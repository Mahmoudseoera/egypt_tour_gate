// app/page.tsx
"use client";

import { useState } from "react";
import { Activity, Zap, Clock, AlertCircle, CheckCircle } from "lucide-react";

// Define our benchmarks based on industry standards (Google Core Web Vitals)
const BENCHMARKS = [
  { max: 100, label: "Instant", color: "text-green-500", bg: "bg-green-500", icon: Zap },
  { max: 300, label: "Fast", color: "text-emerald-500", bg: "bg-emerald-500", icon: CheckCircle },
  { max: 1000, label: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500", icon: Clock },
  { max: Infinity, label: "Slow", color: "text-red-500", bg: "bg-red-500", icon: AlertCircle },
];

export default function Home() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ durationMs: number; status: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/measure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to measure");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine status color
  const getStatus = (ms: number) => {
    return BENCHMARKS.find((b) => ms <= b.max) || BENCHMARKS[BENCHMARKS.length - 1];
  };

  const currentStatus = result ? getStatus(result.durationMs) : null;
  const Icon = currentStatus?.icon || Activity;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            API Latency Checker
          </h1>
          <p className="text-slate-400">
            Optimized for React 19 & Next.js 16 Server Components
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTest} className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/data"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center gap-2"
          >
            {loading ? "Testing..." : "Test Speed"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900 text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex justify-center">
              <div className={`p-4 rounded-full bg-slate-800 ${currentStatus?.color}`}>
                <Icon size={48} />
              </div>
            </div>

            <div>
              <div className="text-6xl font-bold tracking-tighter">
                {result.durationMs}<span className="text-2xl text-slate-500 font-normal">ms</span>
              </div>
              <div className={`text-xl font-medium mt-2 ${currentStatus?.color}`}>
                {currentStatus?.label} Response
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider">HTTP Status</p>
                <p className={`font-mono ${result.status === 200 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {result.status}
                </p>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Target</p>
                <p className="truncate text-slate-300">{result.url}</p>
              </div>
            </div>
          </div>
        )}

        {/* Benchmark Guide */}
        <div className="bg-slate-900/50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Performance Benchmarks
          </h3>
          <div className="space-y-3">
            {BENCHMARKS.map((bench) => (
              <div key={bench.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${bench.bg}`} />
                  <span className="text-slate-300">{bench.label}</span>
                </div>
                <span className="text-slate-500 font-mono">
                  {bench.max === Infinity ? "> 1000ms" : `< ${bench.max}ms`}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}