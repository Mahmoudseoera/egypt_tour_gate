export interface BlogCategory {
  slug: string;
  parentSlug?: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
}

export interface BlogPost {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
}

export const blogCategories: BlogCategory[] = [
  {
    slug: "egypt-tours-guide",
    title: "Egypt Tours Guide",
    description: "Complete guides for exploring ancient Egypt's wonders, from pyramids to temples",
    image: "/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp",
    icon: "🏛️"
  },
  {
    slug: "travel-tips",
    title: "Travel Tips",
    description: "Essential travel advice, packing guides, and insider tips for your Egyptian adventure",
    image: "/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp",
    icon: "✈️"
  },
  {
    slug: "cultural-experiences",
    title: "Cultural Experiences",
    description: "Immerse yourself in Egyptian culture, cuisine, and local traditions",
    image: "/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp",
    icon: "🎭"
  },
  {
    slug: "historical-insights",
    title: "Historical Insights",
    description: "Deep dives into ancient Egyptian history, pharaohs, and archaeological discoveries",
    image: "/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp",
    icon: "📜"
  },
  {
    slug: "adventure-activities",
    title: "Adventure Activities",
    description: "Diving, desert safaris, hot air balloons, and thrilling Egyptian adventures",
    image: "/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp",
    icon: "🏄"
  },
  {
    slug: "luxury-travel",
    title: "Luxury Travel",
    description: "Premium experiences, 5-star hotels, and exclusive tours in Egypt",
    image: "/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp",
    icon: "💎"
  }
];

export const blogPosts: BlogPost[] = [
  // Egypt Tours Guide
  {
    slug: "great-sphinx-giza-ultimate-guide",
    categorySlug: "egypt-tours-guide",
    title: "The Great Sphinx of Giza: Ultimate Visitor's Guide",
    excerpt: "Discover everything you need to know about visiting the enigmatic Sphinx, from its mysterious history to the best photo spots and viewing times.",
    content: `
# The Great Sphinx of Giza: Ultimate Visitor's Guide

The Great Sphinx stands as one of the most iconic monuments in human history. This colossal limestone statue with the body of a lion and the head of a pharaoh has captivated visitors for millennia.

## History and Significance

Built around 2500 BCE during the reign of Pharaoh Khafre, the Sphinx measures 73 meters long and 20 meters high. It's believed to represent the pharaoh as a guardian of the Giza plateau.

## Best Time to Visit

**Early Morning (6-8 AM)**
- Fewer crowds
- Softer lighting for photography
- Cooler temperatures

**Golden Hour (4-6 PM)**
- Stunning sunset views
- Beautiful golden light on the limestone
- More dramatic shadows

## Photography Tips

1. **Classic Front View**: Position yourself at the viewing platform for the iconic face-on shot
2. **Side Profile**: Walk to the southern viewing area for the complete body silhouette
3. **With Pyramids**: Find the elevated spots that capture both the Sphinx and pyramids in one frame

## Insider Tips

- Book a sunrise private tour to avoid crowds
- The sound and light show offers unique evening perspectives
- Combine your visit with the Solar Boat Museum nearby
- Hire a knowledgeable guide to learn the hidden details

## What to Bring

- Wide-angle lens for full monument shots
- Sun protection (hat, sunscreen)
- Comfortable walking shoes
- Water bottle

## Mysteries and Theories

The Sphinx continues to puzzle archaeologists:
- The missing nose (removed in medieval times)
- Weathering patterns suggesting older origins
- Hidden chambers beneath the paws
- The Sphinx's true purpose and meaning

Plan at least 1-2 hours for your Sphinx visit to fully appreciate this ancient wonder.
    `,
    image: "/images/posts/sphinx-guide.jpg",
    author: {
      name: "Dr. Ahmed Hassan",
      avatar: "/images/authors/ahmed.jpg"
    },
    publishedAt: "2024-02-01",
    readTime: "8 min read",
    tags: ["Giza", "Sphinx", "Ancient Egypt", "Photography"]
  },
  {
    slug: "pyramids-of-giza-complete-tour",
    categorySlug: "egypt-tours-guide",
    title: "Pyramids of Giza: Your Complete Tour Guide",
    excerpt: "Navigate the pyramids like a pro with our comprehensive guide covering everything from tickets to hidden chambers.",
    content: `
# Pyramids of Giza: Your Complete Tour Guide

The Giza pyramid complex is Egypt's most visited archaeological site and one of the Seven Wonders of the Ancient World.

## The Three Great Pyramids

### Great Pyramid of Khufu
- Largest of the three at 146.5 meters (original height)
- Built around 2560 BCE
- Contains approximately 2.3 million stone blocks
- Interior tour available (limited daily tickets)

### Pyramid of Khafre
- Appears taller due to elevated position
- Still retains some original casing stones at the apex
- Great photo opportunities from all angles

### Pyramid of Menkaure
- Smallest of the main pyramids
- Beautiful granite casing (partially preserved)
- Less crowded than the larger pyramids

## Ticket Information

**General Admission**: Includes pyramid complex grounds
**Interior Access**: Separate tickets for entering pyramids
**Student Discounts**: Available with valid ID

## Tour Options

1. **Self-Guided**: Maximum flexibility, budget-friendly
2. **Group Tours**: Social experience, knowledgeable guides
3. **Private Tours**: Personalized attention, flexible schedule
4. **Camel Tours**: Traditional desert experience

## Best Routes

**Morning Circuit**: Start at Khufu → Khafre → Menkaure → Sphinx
**Photography Route**: Begin at panoramic viewpoint → individual pyramids → Sphinx at sunset

## Don't Miss

- The Solar Boat Museum
- Queen's Pyramids
- Workers' Cemetery
- Valley Temple of Khafre

## Practical Tips

- Arrive early (7 AM opening time)
- Wear comfortable, closed-toe shoes
- Bring your own water and snacks
- Consider hiring a guide for historical context
- Beware of unofficial "guides" and scams

The pyramids deserve a full day of exploration to truly appreciate their magnificence.
    `,
    image: "/images/posts/pyramids-tour.jpg",
    author: {
      name: "Sarah Mitchell",
      avatar: "/images/authors/sarah.jpg"
    },
    publishedAt: "2024-01-28",
    readTime: "12 min read",
    tags: ["Pyramids", "Giza", "World Wonders", "Ancient Egypt"]
  },
  {
    slug: "luxor-karnak-temple-guide",
    categorySlug: "egypt-tours-guide",
    title: "Karnak Temple Complex: Luxor's Crown Jewel",
    excerpt: "Explore the largest religious building ever constructed with our detailed guide to the magnificent Karnak Temple.",
    content: `
# Karnak Temple Complex: Luxor's Crown Jewel

Karnak Temple is the second most visited site in Egypt, and for good reason. This vast complex of temples, chapels, and obelisks represents 2,000 years of construction and devotion.

## The Great Hypostyle Hall

The crown jewel of Karnak, this hall features 134 massive columns arranged in 16 rows. Each column is covered in intricate hieroglyphics and reaches up to 21 meters high.

**Best Experience**: Visit in late afternoon when the sun creates dramatic shadows between the columns.

## Sacred Lake

This ancient artificial lake was used by priests for purification rituals. Today, it offers:
- Peaceful reflection spots
- Excellent photo opportunities
- Sound and Light Show seating area

## The Avenue of Sphinxes

A 2.7-kilometer processional road lined with sphinx statues connecting Karnak to Luxor Temple. Recently restored and reopened in 2021.

## Temple Highlights

1. **Temple of Amun-Ra**: The main temple complex
2. **Temple of Mut**: Dedicated to the mother goddess
3. **Temple of Khonsu**: Well-preserved smaller temple
4. **Precinct of Montu**: Northern section, less crowded

## Sound and Light Show

**Schedule**: Nightly shows at 6:30 PM and 8:00 PM (seasonal variations)
**Duration**: 90 minutes
**Languages**: Available in multiple languages
**Tip**: Book in advance during peak season

## Visitor Information

**Opening Hours**: 6 AM - 5:30 PM (winter), 6 AM - 6:30 PM (summer)
**Recommended Duration**: 3-4 hours minimum
**Best Time**: Early morning or late afternoon to avoid heat and crowds

## Practical Tips

- Hire a guide for the first visit to understand the complex layout
- Bring a wide-angle lens for the Hypostyle Hall
- Wear comfortable shoes (lots of walking on uneven surfaces)
- Combine with Luxor Temple for a full "Theban" experience

Karnak is more than a temple—it's a journey through ancient Egyptian civilization.
    `,
    image: "/images/posts/karnak-temple.jpg",
    author: {
      name: "Dr. Mohamed Saleh",
      avatar: "/images/authors/mohamed.jpg"
    },
    publishedAt: "2024-01-25",
    readTime: "10 min read",
    tags: ["Luxor", "Temples", "Karnak", "Ancient Egypt"]
  },

  // Travel Tips
  {
    slug: "best-time-visit-egypt",
    categorySlug: "travel-tips",
    title: "When to Visit Egypt: Complete Seasonal Guide",
    excerpt: "Find the perfect time for your Egyptian adventure with our comprehensive seasonal breakdown and insider recommendations.",
    content: `
# When to Visit Egypt: Complete Seasonal Guide

Choosing the right time to visit Egypt can make or break your experience. Here's everything you need to know about Egypt's seasons.

## Peak Season (October - April)

### Advantages
- Perfect weather (15-25°C)
- Ideal for outdoor exploration
- All sites fully accessible
- Festivals and cultural events

### Disadvantages
- Higher prices (hotels, tours)
- Crowded tourist sites
- Book accommodations early
- Long queues at major attractions

## Shoulder Season (March-April, September-October)

**The Sweet Spot for Most Travelers**

- Moderate temperatures
- Smaller crowds than peak season
- Better prices than winter
- Pleasant Nile cruise weather

## Summer (May - August)

### Considerations
- Very hot (35-45°C in Upper Egypt)
- Significant discounts available
- Mediterranean coast comfortable
- Indoor sites (museums) more pleasant

### Who Should Visit
- Budget travelers
- Heat-tolerant adventurers
- Museum and indoor attraction fans
- Red Sea diving enthusiasts

## Regional Climate Variations

### Cairo and Giza
- Best: November - March
- Summer: Very hot and humid
- Winter: Mild, occasional rain

### Luxor and Aswan
- Best: December - February
- Summer: Extremely hot (40°C+)
- Comfortable evenings year-round

### Alexandria and Mediterranean Coast
- Best: April - October
- Pleasant summer beach weather
- Mild, rainy winters

### Red Sea (Hurghada, Sharm el-Sheikh)
- Best: March - May, September - November
- Year-round diving (water warmest in summer)
- Winter diving requires wetsuit

## Special Events Calendar

**January**: Cairo International Film Festival
**February**: Abu Simbel Sun Festival
**March**: Spring flowers bloom
**April**: Coptic Easter celebrations
**September**: Islamic New Year (dates vary)
**October**: Abu Simbel Sun Festival (again)
**November**: Luxor African Film Festival

## Money-Saving Tips by Season

**Winter (High Season)**
- Book 3-4 months in advance
- Consider weekday arrivals
- Stay slightly outside main tourist areas

**Summer (Low Season)**
- Last-minute deals abundant
- Negotiate tour prices
- 5-star hotels at 3-star prices

## My Personal Recommendation

**First-Time Visitors**: November or February
- Perfect weather balance
- Crowds manageable
- Full experience accessible

**Return Visitors**: April or October
- See different seasonal aspects
- Better prices
- More authentic local interactions

**Budget Travelers**: July or August
- Incredible value
- Early morning and evening activities
- Focus on Red Sea and Mediterranean

The best time ultimately depends on your priorities: weather, budget, crowds, or specific events.
    `,
    image: "/images/posts/best-time-visit.jpg",
    author: {
      name: "Sarah Mitchell",
      avatar: "/images/authors/sarah.jpg"
    },
    publishedAt: "2024-02-05",
    readTime: "9 min read",
    tags: ["Travel Planning", "Weather", "Seasons", "Budget Travel"]
  },
  {
    slug: "egypt-packing-essentials",
    categorySlug: "travel-tips",
    title: "Egypt Packing List: Essential Guide for Every Season",
    excerpt: "Pack like a pro with our comprehensive checklist covering clothing, gadgets, medications, and cultural considerations.",
    content: `
# Egypt Packing List: Essential Guide for Every Season

Packing for Egypt requires balancing comfort, cultural sensitivity, and practical needs. Here's your ultimate guide.

## Clothing Essentials

### Year-Round Basics
- Lightweight, breathable fabrics (cotton, linen)
- Long pants and long-sleeved shirts (temple visits, sun protection)
- Modest dress for religious sites
- Comfortable walking shoes (broken in!)
- Sandals for casual wear
- Light jacket or shawl (air-conditioned spaces)

### Winter Additions (November - February)
- Warm jacket for evenings
- Long pants for cooler mornings
- Light sweater or fleece
- Closed-toe shoes

### Summer Extras (June - August)
- Wide-brimmed hat
- UV-protection clothing
- Sunglasses (essential)
- Light scarf for sun protection

## Cultural Dress Guidelines

**For Women**
- Cover shoulders and knees at religious sites
- Light scarf for mosque visits
- Avoid tight or revealing clothing in public
- Swimwear only at beaches/pools

**For Men**
- No shorts at mosques or religious sites
- T-shirts acceptable in most places
- Long pants for temple visits

## Tech and Gadgets

✓ Universal power adapter (Egypt uses Type C/F plugs, 220V)
✓ Power bank (essential for long tour days)
✓ Camera with extra batteries
✓ Smartphone with local SIM option
✓ Waterproof phone case (Nile cruises, beach)
✓ E-reader for long flights
✓ Headphone adapter

## Health and Medications

### Must-Haves
- Prescription medications (bring extras)
- Anti-diarrheal medication
- Rehydration salts
- Pain relievers
- Antihistamines
- Motion sickness pills (for Nile cruises)
- First aid kit basics
- Insect repellent (especially for Nile cruises)

### Sun Protection
- High SPF sunscreen (50+)
- Lip balm with SPF
- Aloe vera gel
- After-sun lotion

## Practical Accessories

- Reusable water bottle
- Daypack or crossbody bag
- Money belt or hidden pouch
- Travel locks
- Ziplock bags (sand protection)
- Wet wipes/hand sanitizer
- Tissues (public restrooms vary)
- Microfiber towel
- Laundry detergent packets

## Photography Gear

- Wide-angle lens (architecture)
- Telephoto lens (detail shots)
- Lens cleaning kit (dust!)
- Camera rain/dust cover
- Extra memory cards
- Portable hard drive for backup

## Documents and Money

### Essential Documents
- Passport (valid 6+ months)
- Visa (can get on arrival)
- Travel insurance documents
- Hotel confirmations
- Photocopies of important documents
- International driver's license (if renting)

### Money Matters
- Mix of cash (USD and Egyptian pounds)
- Credit cards (Visa/Mastercard widely accepted)
- ATM card
- Hidden emergency cash

## Optional but Recommended

- Turkish towel (multi-purpose)
- Collapsible water bottle
- Portable clothesline
- Sleep mask and earplugs
- Playing cards for downtime
- Small flashlight
- Notebook and pen

## What NOT to Pack

✗ Expensive jewelry
✗ Drone (requires special permits)
✗ Too many shoes (2-3 pairs max)
✗ Heavy guidebooks (use apps instead)
✗ Full-size toiletries (buy locally if needed)

## Packing Strategy

**Roll, Don't Fold**: Saves space and reduces wrinkles
**Use Packing Cubes**: Organize by category or outfit
**Wear Bulkiest Items on Flight**: Shoes, jacket
**Leave Space**: For souvenirs and purchases

## Seasonal Adjustments

### Winter (Nov-Feb)
Add: Warm layers, light rain jacket
Remove: Heavy summer protection

### Summer (Jun-Aug)
Add: Extra sun protection, cooling towel
Remove: Warm layers (except light jacket for AC)

## Final Tips

1. **Pack light**: You'll buy things in Egypt
2. **Check baggage allowances**: Especially for internal flights
3. **Prepare for dust**: Bring spare ziplock bags
4. **Consider laundry services**: Available at most hotels
5. **Leave fancy clothes home**: Casual, practical clothing works best

Remember: You can buy most forgotten items in major Egyptian cities, though specific medications and tech may be harder to find.
    `,
    image: "/images/posts/packing-essentials.jpg",
    author: {
      name: "Lisa Thompson",
      avatar: "/images/authors/lisa.jpg"
    },
    publishedAt: "2024-02-03",
    readTime: "11 min read",
    tags: ["Packing", "Travel Preparation", "Essentials", "Travel Tips"]
  },

  // Cultural Experiences
  {
    slug: "egyptian-cuisine-food-guide",
    categorySlug: "cultural-experiences",
    title: "Egyptian Cuisine: A Food Lover's Complete Guide",
    excerpt: "From street food to fine dining, discover the rich flavors and dishes that define Egyptian culinary culture.",
    content: `
# Egyptian Cuisine: A Food Lover's Complete Guide

Egyptian cuisine is a delicious blend of Mediterranean, Middle Eastern, and African influences, with recipes passed down through generations.

## Must-Try Dishes

### Koshari
Egypt's national dish—a comforting mix of:
- Rice, lentils, and macaroni
- Topped with spicy tomato sauce
- Garnished with crispy fried onions
- Chickpeas throughout

**Where to Try**: Abou Tarek in Cairo (the most famous spot)

### Ful Medames
Traditional breakfast featuring:
- Slow-cooked fava beans
- Olive oil, lemon, garlic
- Served with fresh bread
- Often topped with eggs

**Pro Tip**: Locals eat it with pickled vegetables

### Molokhia
A unique green soup made from jute leaves:
- Garlic and coriander flavor
- Served over rice
- Accompanied by chicken or rabbit
- Controversial (love it or hate it!)

### Ta'meya (Egyptian Falafel)
Different from Middle Eastern versions:
- Made from fava beans (not chickpeas)
- Bright green inside
- Served in baladi bread
- Perfect street food snack

### Mahshi
Vegetables stuffed with rice mixture:
- Grape leaves, zucchini, peppers
- Seasoned rice with herbs
- Slow-cooked in tomato sauce
- Traditional family meal

## Street Food Culture

### Best Street Food

**Hawawshi**
- Spiced meat in baladi bread
- Baked until crispy
- Egypt's answer to pizza

**Shawarma**
- Thinly sliced meat on spit
- Wrapped in pita bread
- Tahini sauce essential
- Available everywhere

**Fresh Juice Stands**
- Sugarcane juice (must-try!)
- Mango, orange, guava
- Made to order
- Incredibly refreshing

### Street Food Safety

✓ Choose busy stalls (high turnover)
✓ Watch food being prepared
✓ Avoid unpeeled fruits
✓ Bottled water only
✓ Trust your instincts

## Desserts and Sweets

### Umm Ali
Egypt's most beloved dessert:
- Bread pudding with nuts
- Coconut, raisins, cream
- Served warm
- Incredibly rich

### Basbousa
Semolina cake soaked in syrup:
- Coconut flavor
- Sweet and moist
- Often topped with almonds
- Perfect with tea

### Konafa
Crispy shredded pastry:
- Filled with cream or nuts
- Soaked in sugar syrup
- Orange blossom water flavor
- Special during Ramadan

## Beverages

### Hot Drinks
- **Shai (Tea)**: Offered everywhere, strong and sweet
- **Ahwa (Coffee)**: Turkish-style, thick and cardamom-scented
- **Sahlab**: Winter drink made from orchid root
- **Karkadeh**: Hibiscus tea, served hot or cold

### Cold Drinks
- **Tamr Hindi**: Tamarind juice
- **Sob**: Drink from hibiscus
- **Erfa Soda**: Cinnamon-flavored soda
- **Fresh Lemon Mint**: Refreshing and everywhere

## Regional Specialties

### Alexandria
- Fresh seafood
- Fish prepared dozen ways
- Fatta (special rice and meat dish)

### Aswan
- Nubian cuisine
- Grilled fish from the Nile
- Unique spice blends

### Siwa Oasis
- Date-based dishes
- Olive oil cuisine
- Siwan tea

## Dining Etiquette

**At Traditional Restaurants**
- Remove shoes at some local places
- Eating with hands is acceptable
- Right hand only
- Bread is the utensil
- It's polite to leave a small amount

**Tipping (Baksheesh)**
- 10-15% at restaurants
- Round up for street food
- Small notes for exceptional service

## Food Tours Worth Taking

1. **Cairo Street Food Tour**: Sample 10+ dishes in 4 hours
2. **Khan el-Khalili Food Walk**: Historic market tastings
3. **Alexandria Seafood Experience**: Fresh catch and preparation
4. **Nubian Cooking Class**: Hands-on traditional cooking

## Where to Eat

### Budget Eats ($)
- Local ahwas (cafés)
- Street food stalls
- Traditional ta'meya shops
- Koshari restaurants

### Mid-Range ($$)
- Abu Tarek (Koshari)
- Felfela (Egyptian classics)
- Semsema (Zamalek)
- Local seafood restaurants

### Fine Dining ($$$)
- Abou El Sid (Egyptian fine dining)
- Sequoia (Nile views)
- Zooba (modern Egyptian)
- Hotel restaurants

## Food Safety Tips

- Stick to cooked food when starting out
- Avoid tap water (even for brushing teeth)
- Peel fruits yourself
- Hot food is safer than cold
- Carry anti-diarrheal medication (just in case)

## Vegetarian Options

Egypt is surprisingly vegetarian-friendly:
- Koshari (naturally vegan)
- Ta'meya (falafel)
- Ful medames
- Baba ghanoush
- Tahini-based dishes
- Fresh salads (careful with washing)

## Seasonal Specialties

**Ramadan**: Special desserts, festive meals, street parties
**Coptic Christmas**: Unique fasting and feasting foods
**Sham el-Nessim**: Spring festival with traditional fish dishes

Egyptian food is about more than eating—it's about hospitality, tradition, and bringing people together. Don't be shy to try new things!
    `,
    image: "/images/posts/egyptian-cuisine.jpg",
    author: {
      name: "Fatima El-Sayed",
      avatar: "/images/authors/fatima.jpg"
    },
    publishedAt: "2024-01-30",
    readTime: "14 min read",
    tags: ["Food", "Culture", "Cuisine", "Restaurants", "Street Food"]
  },

  // Historical Insights
  {
    slug: "ancient-egypt-pharaohs-dynasties",
    categorySlug: "historical-insights",
    title: "Ancient Egypt's Greatest Pharaohs and Their Dynasties",
    excerpt: "Journey through 3,000 years of pharaonic rule, from Narmer to Cleopatra, and discover the rulers who shaped civilization.",
    content: `
# Ancient Egypt's Greatest Pharaohs and Their Dynasties

Ancient Egypt's 3,000-year history produced some of the most powerful and fascinating rulers in human civilization.

## The Old Kingdom: Age of the Pyramids

### Khufu (2589-2566 BCE)
**Dynasty**: 4th
**Achievement**: Built the Great Pyramid of Giza
**Legacy**: Created the last remaining Ancient Wonder

The Great Pyramid remained the world's tallest structure for 3,800 years. Khufu mobilized unprecedented resources to create his eternal monument.

### Khafre (2558-2532 BCE)
**Dynasty**: 4th
**Achievement**: Built second Giza pyramid and the Great Sphinx
**Legacy**: Created the iconic guardian of the plateau

### Menkaure (2532-2503 BCE)
**Dynasty**: 4th
**Achievement**: Built third (smallest) Giza pyramid
**Legacy**: Known for more modest building and religious reforms

## The Middle Kingdom: Renaissance

### Mentuhotep II (2055-2004 BCE)
**Dynasty**: 11th
**Achievement**: Reunified Egypt after First Intermediate Period
**Legacy**: Restored Egyptian power and stability

### Senusret III (1878-1839 BCE)
**Dynasty**: 12th
**Achievement**: Military campaigns, administrative reforms
**Legacy**: Secured borders, expanded trade networks

## The New Kingdom: Imperial Glory

### Hatshepsut (1479-1458 BCE)
**Dynasty**: 18th
**Achievement**: One of few female pharaohs
**Notable**: Massive building projects, including Deir el-Bahari temple
**Legacy**: Successful 22-year peaceful reign, extensive trade expeditions

Why remarkable:
- Ruled as "king," not queen
- Wore traditional male pharaoh regalia
- Created unprecedented prosperity
- Later rulers tried to erase her memory

### Thutmose III (1479-1425 BCE)
**Dynasty**: 18th
**Achievement**: Egypt's greatest military pharaoh
**Campaigns**: 17 military campaigns
**Legacy**: Expanded empire to maximum extent

Known as the "Napoleon of Egypt," he conquered territories from Nubia to Syria.

### Akhenaten (1353-1336 BCE)
**Dynasty**: 18th
**Revolutionary**: Introduced monotheism (worship of Aten)
**Impact**: Abandoned traditional polytheism
**Legacy**: Art revolution, capital moved to Amarna

Most controversial pharaoh—religious radical or visionary?

### Tutankhamun (1332-1323 BCE)
**Dynasty**: 18th
**Famous For**: Intact tomb discovery (1922)
**Reality**: Minor pharaoh, died young (age 19)
**Legacy**: Most famous pharaoh due to tomb treasures

### Ramesses II "The Great" (1279-1213 BCE)
**Dynasty**: 19th
**Reign**: 67 years (one of longest)
**Monuments**: Abu Simbel, Ramesseum, countless others
**Legacy**: Egypt's most prolific builder

Achievements:
- Battle of Kadesh (first recorded peace treaty)
- Over 100 children
- Massive building program throughout Egypt
- Lived to approximately 90 years old

### Ramesses III (1186-1155 BCE)
**Dynasty**: 20th
**Achievement**: Defended Egypt from Sea Peoples invasion
**Legacy**: Last great pharaoh of New Kingdom

## Late Period Notable Rulers

### Cleopatra VII (51-30 BCE)
**Dynasty**: Ptolemaic (Macedonian Greek)
**Famous For**: Relationships with Caesar and Mark Antony
**Achievement**: Last pharaoh of Egypt
**Legacy**: End of pharaonic Egypt, beginning of Roman rule

Reality vs. myth:
- Highly educated (spoke 9 languages)
- Skilled politician and strategist
- Not as beautiful as portrayed—intelligence was her power
- Represented Isis incarnate

## The Dynasty Timeline

**Early Dynastic (3100-2686 BCE)**
- Dynasties 1-2
- Unification of Upper and Lower Egypt
- Establishment of Memphis

**Old Kingdom (2686-2181 BCE)**
- Dynasties 3-6
- Age of pyramid building
- Strong centralized power

**First Intermediate Period (2181-2055 BCE)**
- Dynasties 7-10
- Political fragmentation
- Regional power struggles

**Middle Kingdom (2055-1650 BCE)**
- Dynasties 11-13
- Cultural renaissance
- Literary golden age

**Second Intermediate Period (1650-1550 BCE)**
- Dynasties 14-17
- Hyksos rulers in north
- Native rulers in Thebes

**New Kingdom (1550-1077 BCE)**
- Dynasties 18-20
- Imperial expansion
- Greatest power and wealth
- Valley of the Kings burials

**Third Intermediate Period (1077-664 BCE)**
- Dynasties 21-25
- Divided rule
- Foreign invasions

**Late Period (664-332 BCE)**
- Dynasties 26-31
- Persian invasions
- Brief native renaissance

**Ptolemaic Period (332-30 BCE)**
- Greek rulers
- Macedonian Dynasty
- Ended with Cleopatra

## How Pharaohs Ruled

**Divine Status**: Living gods on earth
**Responsibilities**:
- Maintaining Ma'at (cosmic order)
- Defending Egypt's borders
- Building temples to the gods
- Ensuring Nile floods

**Succession**: Usually father to son
- Exceptions: Queens, usurpers, adoptions
- Co-regencies common (training successors)

## Pharaonic Symbols

**The Double Crown**: Combined Upper and Lower Egypt
**Crook and Flail**: Symbols of kingship
**False Beard**: Divine attribute (even female pharaohs wore it)
**Uraeus (Cobra)**: Protective symbol on crown

## Modern Discoveries

New pharaohs and information still being discovered:
- 2015: Tomb of previously unknown queen
- 2019: New tomb discoveries in Saqqara
- Ongoing: DNA testing revealing family relationships
- Technology: New scanning revealing hidden chambers

## Visiting Pharaonic Sites

**Cairo/Giza**: Old Kingdom pyramids and museums
**Luxor**: New Kingdom temples and Valley of the Kings
**Aswan**: Abu Simbel (Ramesses II)
**Alexandria**: Ptolemaic heritage
**Saqqara**: Step Pyramid and early dynasties

The pharaohs created a civilization that lasted 3,000 years—longer than any empire before or since. Their monuments, achievements, and mysteries continue to captivate us today.
    `,
    image: "/images/posts/pharaohs-dynasties.jpg",
    author: {
      name: "Dr. Ahmed Hassan",
      avatar: "/images/authors/ahmed.jpg"
    },
    publishedAt: "2024-01-20",
    readTime: "15 min read",
    tags: ["History", "Pharaohs", "Ancient Egypt", "Dynasties"]
  },

  // Adventure Activities
  {
    slug: "red-sea-diving-guide",
    categorySlug: "adventure-activities",
    title: "Red Sea Diving: Complete Guide to Egypt's Underwater Paradise",
    excerpt: "Explore world-class dive sites, vibrant coral reefs, and incredible marine life in the Red Sea's crystal-clear waters.",
    content: `
# Red Sea Diving: Complete Guide to Egypt's Underwater Paradise

The Red Sea is considered one of the world's top diving destinations, offering incredible visibility, diverse marine life, and year-round diving conditions.

## Best Dive Destinations

### Sharm El-Sheikh
**Famous For**: Accessible dive sites, variety
**Top Sites**:
- Ras Mohammed National Park
- Tiran Straits
- SS Thistlegorm wreck

**Best For**: All levels, from beginners to technical divers

### Dahab
**Famous For**: Shore diving, budget-friendly
**Top Sites**:
- Blue Hole (advanced divers only)
- Canyon
- Eel Garden

**Best For**: Budget divers, free divers, technical diving

### Hurghada
**Famous For**: Family-friendly, wreck diving
**Top Sites**:
- Giftun Island
- Abu Nuhas (wreck alley)
- Sha'ab El Erg

**Best For**: Beginners, families, wreck enthusiasts

### Marsa Alam
**Famous For**: Pristine reefs, dugongs, dolphins
**Top Sites**:
- Elphinstone Reef
- Dolphin House
- Fury Shoals

**Best For**: Experienced divers, marine life enthusiasts

## Iconic Dive Sites

### SS Thistlegorm
- WWII British cargo ship
- Sunk in 1941
- Motorcycles, trucks, ammunition still visible
- 30-meter depth
- Advanced divers recommended

### Blue Hole, Dahab
- World-famous (and infamous) dive site
- 130-meter deep underwater sinkhole
- Beautiful but dangerous
- Several fatalities each year
- "The Arch" exit requires technical diving skills

### Ras Mohammed
- Egypt's first national park
- Shark and Yolanda Reef
- Strong currents (drift diving)
- Incredible coral walls
- Shark sightings common

## Marine Life Encounters

### Common Sightings
- Colorful reef fish (parrotfish, angelfish, butterflyfish)
- Moray eels
- Lionfish
- Octopus
- Sea turtles

### Special Encounters
- **Dolphins**: Spinner dolphins, bottlenose dolphins
- **Sharks**: Oceanic whitetip, hammerhead, reef sharks
- **Rays**: Manta rays, eagle rays, stingrays
- **Dugongs**: Rare, mainly Marsa Alam
- **Whale Sharks**: Seasonal visitors

## Best Time to Dive

### Year-Round Diving
The Red Sea offers diving 365 days a year, but conditions vary:

**Winter (December - February)**
- Water: 21-23°C (wetsuit recommended)
- Visibility: Excellent (30-40 meters)
- Marine Life: Fewer big fish
- Conditions: Occasional wind, choppier surface

**Spring (March - May)**
- Water: 23-25°C
- Visibility: Excellent
- Marine Life: Increasing activity
- Best overall conditions

**Summer (June - August)**
- Water: 26-28°C (warmest)
- Visibility: Good (20-30 meters)
- Marine Life: Peak season
- Conditions: Calm seas, hot topside

**Fall (September - November)**
- Water: 25-27°C
- Visibility: Excellent
- Marine Life: Manta rays possible
- Great conditions

## Diving Certifications

### Open Water Diver (Beginner)
- 3-4 day course
- Dive to 18 meters
- Cost: $300-400
- Available everywhere

### Advanced Open Water
- 2-3 day course
- Dive to 30 meters
- Deep dive and navigation required
- Cost: $250-350

### Specialty Courses Available
- Wreck diving
- Night diving
- Nitrox
- Deep diving
- Technical diving

### Recommended Progression
1. Start with Open Water in Hurghada/Sharm
2. Advanced course after 10-15 dives
3. Specialties as interests develop
4. Consider technical training for Blue Hole/deep wrecks

## Liveaboard vs. Day Trips

### Day Trips
**Pros**:
- Budget-friendly
- Flexible schedule
- Combine with land tourism
- No seasickness worries

**Cons**:
- Limited to nearby sites
- Less dive time
- Crowded sites
- Transit time on boats

**Best For**: Beginners, budget travelers, short trips

### Liveaboards
**Pros**:
- Access to remote sites
- 3-4 dives daily
- Better diving experience
- All-inclusive

**Cons**:
- More expensive ($600-$1500/week)
- 7-day minimum typically
- Seasickness possible
- Less flexibility

**Best For**: Serious divers, week-long trips, experienced divers

## Diving Costs

### Day Diving
- 2-dive day trip: $40-70
- Equipment rental: $15-30/day
- Nitrox: +$5-10/dive

### Courses
- Open Water: $300-400
- Advanced: $250-350
- Specialty: $150-250

### Liveaboards
- Budget: $600-800/week
- Mid-range: $900-1200/week
- Luxury: $1500+/week

## Safety Considerations

### Important Rules
1. **Never dive alone**
2. **Check equipment thoroughly**
3. **Plan your dive, dive your plan**
4. **Respect depth and time limits**
5. **Ascend slowly (18m/min maximum)**
6. **Safety stop at 5 meters for 3-5 minutes**
7. **Stay hydrated**

### Special Red Sea Hazards
- **Strong currents**: Drift diving common
- **Boats**: Surface carefully with marker buoy
- **Lionfish**: Beautiful but venomous spines
- **Fire coral**: Don't touch anything
- **Jellyfish**: Seasonal, usually harmless

### Dive Insurance
Highly recommended:
- DAN (Divers Alert Network)
- World Nomads (dive coverage)
- Cost: $100-200/year

## What to Bring

### Essential Gear
- Mask, snorkel, fins (rental available but personal better)
- Dive computer (recommended)
- Log book
- Certification cards
- Underwater camera (optional)

### Clothing
- Rash guard (sun protection)
- 3mm wetsuit (winter)
- Shorty wetsuit (summer)
- Dive skin (jellyfish protection)

### Topside
- Sunscreen (reef-safe)
- After-sun lotion
- Seasickness medication
- Dry bag for electronics

## Choosing a Dive Center

### What to Look For
✓ PADI or SSI certified
✓ Good online reviews
✓ Well-maintained equipment
✓ Small group sizes (max 4-6 per instructor)
✓ Experienced dive guides
✓ Oxygen on boats
✓ Professional briefings

### Red Flags
✗ Pushing depth/time limits
✗ Poor equipment condition
✗ Rushed training
✗ Too-good-to-be-true prices
✗ No emergency procedures
✗ Overcrowded boats

## Environmental Responsibility

### Reef Protection
- Never touch coral
- Control your buoyancy
- Don't chase marine life
- Take only photos
- Use reef-safe sunscreen
- Don't collect shells or artifacts

### Supporting Conservation
- Choose eco-friendly operators
- Participate in reef cleanups
- Report violations
- Educate others

## Combining Diving with Tourism

### Sample Itineraries

**Week 1: Cultural + Diving**
- Days 1-3: Cairo and Pyramids
- Days 4-7: Red Sea diving (Hurghada/Sharm)

**Week 2: Ultimate Diving**
- 7-day liveaboard to southern sites
- Include Elphinstone, Brothers, Daedalus

**Week 3: Mixed Adventure**
- Luxor temples (2 days)
- Nile cruise to Aswan (3 days)
- Fly to Marsa Alam for diving (2 days)

The Red Sea offers something for every diver, from your first breaths underwater to challenging technical dives. With warm water, incredible visibility, and diverse marine life, it's a bucket-list destination for divers worldwide.
    `,
    image: "/images/posts/red-sea-diving.jpg",
    author: {
      name: "Captain Mahmoud Ali",
      avatar: "/images/authors/mahmoud.jpg"
    },
    publishedAt: "2024-01-15",
    readTime: "16 min read",
    tags: ["Diving", "Red Sea", "Adventure", "Marine Life", "Water Sports"]
  },

  // Luxury Travel
  {
    slug: "luxury-nile-cruise-guide",
    categorySlug: "luxury-travel",
    title: "Luxury Nile Cruises: The Ultimate Guide to Sailing in Style",
    excerpt: "Experience Egypt's timeless river journey aboard world-class luxury vessels with gourmet dining, spa treatments, and exclusive excursions.",
    content: `
# Luxury Nile Cruises: The Ultimate Guide to Sailing in Style

A luxury Nile cruise combines ancient wonders with modern opulence, offering an unforgettable journey through the heart of Egypt.

## Why Choose a Luxury Cruise

### The Luxury Difference
- **Smaller ships**: 20-80 passengers vs. 100-200
- **Spacious suites**: 350+ sq ft vs. 200 sq ft
- **Higher staff ratio**: 1:1 or better
- **Gourmet dining**: Michelin-trained chefs
- **Premium excursions**: Private guides, skip-the-line access
- **Spa & wellness**: Full-service onboard facilities

## Top Luxury Cruise Lines

### Sanctuary Retreats
**Ships**: Sun Boat III, Sun Boat IV
**Capacity**: 36-42 passengers
**Style**: British colonial elegance
**Highlights**:
- All suites with French balconies
- Butler service
- Award-winning cuisine
- Egyptologist-led tours

**Price**: $3,500-$5,000 per person (4 nights)

### Oberoi Zahra & Philae
**Capacity**: 50-70 passengers
**Style**: Contemporary luxury
**Highlights**:
- Largest cabins on the Nile (up to 600 sq ft)
- Spa with treatment rooms
- Cigar lounge
- 24-hour butler service
- Private dining options

**Price**: $4,000-$6,000 per person (4 nights)

### Movenpick Royal Lily & Lotus
**Capacity**: 60-64 passengers
**Style**: Modern elegance
**Highlights**:
- Panoramic windows
- Large sun deck with pool
- Fine dining restaurant
- Excellent value for luxury

**Price**: $2,500-$3,500 per person (4 nights)

### Steam Ship Sudan
**Capacity**: 23 passengers
**Style**: Vintage luxury (1885 replica)
**Highlights**:
- Agatha Christie connection ("Death on the Nile")
- Victorian elegance
- Intimate atmosphere
- Historical experience

**Price**: $5,000-$7,000 per person (4 nights)

## Classic Route: Luxor to Aswan (or reverse)

### 4-Night / 5-Day Itinerary

**Day 1: Luxor**
- Embark and settle in
- Evening orientation
- Welcome dinner
- Overnight in Luxor

**Day 2: Luxor West Bank**
- Valley of the Kings (private early access)
- Temple of Hatshepsut
- Colossi of Memnon
- Sail to Edfu
- Afternoon tea on sun deck
- Galabeya party (optional)

**Day 3: Edfu & Kom Ombo**
- Temple of Horus at Edfu (horse carriage ride)
- Sail to Kom Ombo
- Temple of Kom Ombo (evening visit)
- Sail to Aswan
- Captain's welcome dinner

**Day 4: Aswan**
- High Dam
- Unfinished Obelisk
- Philae Temple (private boat)
- Optional: Nubian village visit
- Felucca ride at sunset

**Day 5: Aswan**
- Optional: Abu Simbel excursion (private flight or convoy)
- Disembarkation
- Transfer to airport/hotel

### Extended Routes (7 Nights)

**Luxor to Cairo** (or reverse)
- Includes: Dendera, Abydos, Beni Hassan
- More off-the-beaten-path sites
- Fewer tourists
- Leisurely pace

## Luxury Suite Features

### Standard Suite (Entry-Level Luxury)
- 350-400 sq ft
- King bed or twins
- French balcony or picture window
- Marble bathroom
- Egyptian cotton linens (400+ thread count)
- Nespresso machine
- Premium toiletries
- Nightly turndown service

### Premium Suites
- 500-600 sq ft
- Separate living area
- Private balcony
- Walk-in closet
- Upgraded amenities
- Complimentary minibar
- Priority excursion booking

### Owner's Suite / Presidential Suite
- 800+ sq ft
- Master bedroom + living room
- Wraparound balcony
- Whirlpool tub
- Private butler 24/7
- Exclusive dining options
- Personalized itinerary options

## Onboard Amenities

### Dining
- **Main Restaurant**: Gourmet multi-course dinners
- **Outdoor Dining**: Al fresco breakfast and lunch
- **Private Dining**: Available for special occasions
- **Dietary Accommodations**: Vegetarian, vegan, halal, kosher, allergies

### Wellness
- **Spa**: Massages, facials, body treatments
- **Gym**: Modern equipment
- **Pool**: Sun deck with infinity pool
- **Yoga**: Morning sessions available

### Entertainment
- **Egyptologist Lectures**: Daily presentations
- **Cultural Performances**: Nubian music, belly dancing
- **Library**: Books on Egypt
- **Sun Deck**: Loungers, shaded areas, bar

## Exclusive Experiences

### Private Access
- Early morning or after-hours temple visits
- Skip long queues at popular sites
- Private photography time
- Access to restricted areas (where permitted)

### Special Excursions
- **Hot Air Balloon**: Sunrise over Valley of the Kings
- **Private Felucca**: Sunset sail with champagne
- **Nubian Home Visit**: Authentic cultural experience
- **Private Abu Simbel**: Helicopter or private flight

### Onboard Extras
- **Cooking Classes**: Learn Egyptian cuisine
- **Cocktail Masterclass**: Egyptian-inspired drinks
- **Perfume Workshop**: Create custom scent
- **Hieroglyphics Lesson**: With Egyptologist

## Best Time for Luxury Cruises

### Peak Season (October - April)
**Advantages**:
- Perfect weather (70-85°F)
- Best for sun deck enjoyment
- Ideal for excursions

**Book**: 6-12 months in advance

### Shoulder Season (March-April, September-October)
**Advantages**:
- Moderate temperatures
- Fewer crowds
- Better availability
- Slightly lower prices

### Summer (May - August)
**Considerations**:
- Very hot (95-105°F)
- Significant discounts (30-50% off)
- Air-conditioned comfort onboard
- Early morning excursions

## What's Included

### Typically Included
✓ All meals (breakfast, lunch, dinner, afternoon tea)
✓ Soft drinks and water
✓ Standard excursions with Egyptologist
✓ Entrance fees to sites
✓ Onboard entertainment
✓ Port charges

### Usually Extra
✗ Alcoholic beverages (packages available)
✗ Spa treatments
✗ Gratuities (recommended $50-100/person for crew)
✗ Abu Simbel excursion
✗ Hot air balloon
✗ Personal expenses

## Booking Tips

### When to Book
- **Best prices**: 9-12 months in advance
- **Last minute**: 4-6 weeks before (risk availability)
- **Sweet spot**: 4-6 months ahead

### What to Ask
1. Exact ship and cabin category
2. Deck level and location
3. Guaranteed excursion schedules
4. Group size for tours
5. Beverage package options
6. Dress code for dinners

### Package vs. À La Carte
**Package** (Recommended):
- Cruise + Cairo/Luxor/Aswan hotels
- All transfers
- Additional tours
- Better value

**À La Carte**:
- Just the cruise
- More flexibility
- Book hotels separately

## Packing for Luxury

### Essentials
- Smart casual for dinners (no shorts)
- One formal outfit (captain's dinner)
- Comfortable walking shoes
- Sun protection
- Light jacket for air conditioning
- Binoculars for deck viewing

### Luxury Extras
- Camera with good zoom
- Portable charger
- E-reader for relaxation
- Elegant scarves (women)
- Collared shirts (men)

## Comparing Luxury Levels

### Ultra-Luxury ($5,000+)
- All-inclusive (including alcohol)
- Private guides on all excursions
- Butler service
- Exclusive access
- Maximum 50 passengers

### Premium Luxury ($3,000-$5,000)
- Most inclusions
- Excellent service
- High-quality everything
- 50-80 passengers

### Entry Luxury ($2,000-$3,000)
- Core luxury features
- Good service
- Smaller than mass market
- Excellent value

## Family Considerations

### Family-Friendly Luxury Ships
- Movenpick (interconnecting rooms)
- M/S Mayfair (family suites)

### Kids Activities
- Educational programs with Egyptologist
- Hieroglyphics workshops
- Cultural activities
- Pool time

### Age Recommendations
- Best for ages 8+ (appreciation of history)
- Some ships have minimum age (12+)
- Check policies before booking

## Special Occasions

### Honeymoon
- Suite upgrades
- Sparkling wine in room
- Romantic dinners
- Special turndown
- Couples spa treatments

### Anniversaries
- Private deck dinner
- Cake and celebration
- Photo services
- Special recognition

### Birthdays
- Surprise celebrations
- Custom cakes
- Crew serenades

## Environmental & Social Responsibility

### Eco-Friendly Practices
- Solar panels on newer ships
- Water treatment systems
- Reduced plastic use
- Sustainable sourcing

### Community Impact
- Local guides employed
- Support local artisans
- Cultural exchange programs
- Fair wages for crew

## Final Thoughts

A luxury Nile cruise isn't just about the ship—it's about the total experience: expert guidance, exclusive access, impeccable service, and creating memories that last a lifetime while sailing through one of humanity's greatest historical landscapes.

**Worth the Splurge If**:
- You value comfort and service
- Want deeper historical insights
- Prefer smaller crowds
- Appreciate fine dining
- Seek unique experiences

**Consider Alternatives If**:
- Budget is primary concern
- You prefer independent exploration
- Large groups don't bother you
- Basic comforts sufficient

The Nile has carried travelers for millennia—doing it in luxury is an experience you'll treasure forever.
    `,
    image: "/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp",
    author: {
      name: "Isabella Laurent",
      avatar: "/images/authors/isabella.jpg"
    },
    publishedAt: "2024-01-10",
    readTime: "18 min read",
    tags: ["Luxury Travel", "Nile Cruise", "Premium", "Cruise", "High-End"]
  }
];

// Helper functions
export function getCategoryBySlug(slug?: string): BlogCategory | undefined {
  if (!slug) return undefined;

  const normalized = slug.toLowerCase();

  return blogCategories.find(
    cat => cat.slug.toLowerCase() === normalized
  );
}
export function getPostBySlug(slug?: string): BlogPost | undefined {
  if (!slug) return undefined;

  const normalized = slug.toLowerCase();

  return blogPosts.find(
    post => post.slug.toLowerCase() === normalized
  );
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return blogPosts.filter(
    post => post.categorySlug.toLowerCase() === categorySlug.toLowerCase()
  );
}
export function getLatestPosts(limit: number = 6): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  return blogPosts
    .filter(post => 
      post.slug !== currentPost.slug && 
      (post.categorySlug === currentPost.categorySlug || 
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit);
}
