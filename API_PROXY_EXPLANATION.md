# API Proxy Solution - Complete Explanation

## 📋 Table of Contents
1. [The Problem](#the-problem)
2. [The Solution](#the-solution)
3. [What We Created](#what-we-created)
4. [Changes Made to Existing Files](#changes-made-to-existing-files)
5. [How It Works](#how-it-works)
6. [How to Do This Yourself in the Future](#how-to-do-this-yourself-in-the-future)

---

## 🔴 The Problem

### What was happening:
- Your external API at `https://www.wondertravelegypt.com/api/general` works fine when you visit it directly in the browser
- But when your React component (client-side JavaScript) tried to fetch data from it, the browser blocked the request
- Error: `"Failed to connect to API"` or CORS errors

### Why this happened:
- **CORS (Cross-Origin Resource Sharing)** is a browser security feature
- When JavaScript in your browser tries to fetch data from a different domain (like `wondertravelegypt.com`), the browser checks if that server allows it
- If the external API server doesn't have CORS headers configured to allow your domain, the browser blocks the request
- This is a security feature to prevent malicious websites from accessing your data

---

## ✅ The Solution

We created a **Next.js API Route** that acts as a **proxy** (middleman):

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────────┐
│   Browser   │  ────>  │ Next.js API  │  ────>  │  External API       │
│  (Client)   │         │   Route      │         │  wondertravelegypt   │
│             │  <────  │  (Server)    │  <────  │  .com/api/general   │
└─────────────┘         └──────────────┘         └─────────────────────┘
   Same origin            Server-to-server          External domain
   (No CORS!)             (No CORS!)
```

**Key Point:** The Next.js server can make requests to any external API without CORS restrictions because it's server-to-server communication, not browser-to-server.

---

## 📁 What We Created

### 1. New File: `app/api/general/route.ts`

**Location:** `app/api/general/route.ts`

**What is this?**
- This is a **Next.js API Route** (Next.js 13+ App Router feature)
- In Next.js, any file named `route.ts` inside the `app/api/` folder becomes an API endpoint
- The folder structure determines the URL path:
  - `app/api/general/route.ts` → Creates endpoint at `/api/general`
  - `app/api/users/route.ts` → Creates endpoint at `/api/users`
  - `app/api/tours/[id]/route.ts` → Creates endpoint at `/api/tours/:id`

**What does this file do?**
```typescript
// This function runs on the Next.js SERVER (not in the browser)
export async function GET() {
  // 1. Get the external API URL from environment variable
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // 2. Make a request to the external API (server-to-server, no CORS!)
  const response = await fetch(`${API_BASE_URL}/general`, {
    cache: "no-store",
  });
  
  // 3. Return the data to the client
  return NextResponse.json(data);
}
```

**Key Points:**
- `export async function GET()` - Handles GET requests to this endpoint
- Runs on the **server**, not in the browser
- Can access environment variables directly
- Can fetch from any external API without CORS issues
- Returns JSON response using `NextResponse.json()`

---

## 🔧 Changes Made to Existing Files

### 2. Modified: `lib/api/GeneralApi.ts`

**What changed:**

#### Before:
```typescript
async getGeneralData(): Promise<ApiResponse> {
  return fetchApi<ApiResponse>('/general');  // Direct call to external API
}
```

#### After:
```typescript
async getGeneralData(): Promise<ApiResponse> {
  // Now calls our Next.js API route instead
  const response = await fetch('/api/general', {
    cache: "no-store",
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }
  
  return response.json();
}
```

**Why this change?**
- Instead of calling the external API directly (which causes CORS errors)
- We now call our own Next.js API route at `/api/general`
- This is a same-origin request (no CORS issues!)
- Our Next.js server then fetches from the external API

#### Other improvements in this file:
1. **Better error handling** - Added validation for API_BASE_URL
2. **Improved fetch function** - Better error messages and logging
3. **Flexible data extraction** - Handles different API response structures
4. **Debug logging** - Console logs to help troubleshoot

### 3. Modified: `components/layout/navbar.tsx`

**What changed:**

#### Added loading state handling:
```typescript
const {data, error, loading} = useGeneralData();  // Now uses 'loading' state

// Show loading state
if (loading) {
  return (
    <nav>...</nav>  // Simple loading UI
  );
}

// Show error fallback
if (error || !data) {
  return (
    <header>...</header>  // Fallback UI with hardcoded data
  );
}
```

**Why this change?**
- Before: Component would immediately show error fallback even while loading
- After: Shows loading state first, then either success or error
- Better user experience

#### Added debug logging:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Navbar State:', { loading, error, hasData: !!data, data });
}
```

---

## 🔄 How It Works (Step by Step)

### Flow Diagram:

```
1. User visits your website
   ↓
2. Navbar component loads (client-side)
   ↓
3. useGeneralData() hook runs
   ↓
4. Calls apiService.getGeneralData()
   ↓
5. Fetches from '/api/general' (same origin - no CORS!)
   ↓
6. Next.js server receives request at app/api/general/route.ts
   ↓
7. Server fetches from 'https://www.wondertravelegypt.com/api/general'
   (Server-to-server - no CORS restrictions!)
   ↓
8. Server receives data from external API
   ↓
9. Server returns data to client
   ↓
10. Navbar component receives data and displays it
```

### Example Request Flow:

**Client Request:**
```javascript
// In browser (client-side)
fetch('/api/general')
  .then(res => res.json())
  .then(data => console.log(data))
```

**Server Processing:**
```typescript
// On Next.js server (server-side)
export async function GET() {
  // Fetch from external API
  const response = await fetch('https://www.wondertravelegypt.com/api/general');
  const data = await response.json();
  
  // Return to client
  return NextResponse.json(data);
}
```

---

## 🚀 How to Do This Yourself in the Future

### Step 1: Create the API Route File

1. **Create folder structure:**
   ```
   app/
     api/
       [your-endpoint-name]/
         route.ts
   ```

2. **Example: Creating `/api/tours` endpoint:**
   ```
   app/
     api/
       tours/
         route.ts
   ```

3. **Write the route handler:**
   ```typescript
   import { NextResponse } from "next/server";
   
   export async function GET() {
     const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
     
     if (!API_BASE_URL) {
       return NextResponse.json(
         { error: "API_BASE_URL is not configured" },
         { status: 500 }
       );
     }
   
     try {
       // Fetch from external API
       const response = await fetch(`${API_BASE_URL}/tours`, {
         cache: "no-store",
       });
   
       if (!response.ok) {
         return NextResponse.json(
           { error: `API Error: ${response.status}` },
           { status: response.status }
         );
       }
   
       const data = await response.json();
       return NextResponse.json(data);
     } catch (error) {
       return NextResponse.json(
         { error: "Failed to fetch data" },
         { status: 500 }
       );
     }
   }
   ```

### Step 2: Update Your API Service

**In `lib/api/GeneralApi.ts` or similar file:**

```typescript
export const apiService = {
  async getTours() {
    // Call your Next.js API route instead of external API
    const response = await fetch('/api/tours', {
      cache: "no-store",
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }
    
    return response.json();
  },
};
```

### Step 3: Use in Your Components

```typescript
"use client";
import { useGeneralData } from "@/lib/api/GeneralApi";

export default function MyComponent() {
  const { data, loading, error } = useGeneralData();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Use data here */}</div>;
}
```

---

## 📝 Important Notes

### 1. HTTP Methods
Next.js API routes support different HTTP methods:
- `GET()` - For reading data
- `POST()` - For creating data
- `PUT()` - For updating data
- `DELETE()` - For deleting data
- `PATCH()` - For partial updates

Example:
```typescript
export async function POST(request: Request) {
  const body = await request.json();
  // Process POST request
  return NextResponse.json({ success: true });
}
```

### 2. Dynamic Routes
You can create dynamic API routes:
```
app/api/tours/[id]/route.ts  →  /api/tours/123
```

```typescript
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // Use id in your API call
  const response = await fetch(`${API_BASE_URL}/tours/${id}`);
  return NextResponse.json(await response.json());
}
```

### 3. Environment Variables
- Use `process.env.NEXT_PUBLIC_*` for variables needed in client-side code
- Use regular `process.env.*` for server-only variables (more secure)
- In API routes, you can use either since they run on the server

### 4. Error Handling
Always handle errors properly:
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    // Handle HTTP errors (404, 500, etc.)
    return NextResponse.json(
      { error: "API Error" },
      { status: response.status }
    );
  }
  return NextResponse.json(await response.json());
} catch (error) {
  // Handle network errors
  return NextResponse.json(
    { error: "Network error" },
    { status: 500 }
  );
}
```

---

## 🎯 Summary

**The Problem:** CORS blocking browser requests to external APIs

**The Solution:** Create a Next.js API route that proxies requests

**Key Benefits:**
- ✅ No CORS issues
- ✅ Can add authentication/headers server-side
- ✅ Can cache or transform data
- ✅ Better security (API keys stay on server)

**When to Use:**
- External API doesn't support CORS
- Need to add authentication headers
- Want to transform or cache API responses
- Need to hide API keys from client

**File Structure:**
```
app/
  api/
    [endpoint]/
      route.ts    ← Creates /api/[endpoint]
```

**Pattern:**
1. Create `app/api/[name]/route.ts`
2. Export async function (GET, POST, etc.)
3. Fetch from external API
4. Return NextResponse.json(data)
5. Call `/api/[name]` from your client code

---

## 🔍 Quick Reference

**Create new API endpoint:**
1. Create folder: `app/api/[name]/`
2. Create file: `route.ts`
3. Export: `export async function GET() { ... }`
4. Use: `fetch('/api/[name]')`

**Common patterns:**
- GET data: `export async function GET()`
- POST data: `export async function POST(request: Request)`
- Dynamic routes: `app/api/tours/[id]/route.ts`
- Query params: `new URL(request.url).searchParams.get('key')`

---

This solution solves CORS issues and gives you a clean way to proxy external API calls through your Next.js server!

