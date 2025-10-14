// src/data/chefs.ts

// ---- 型別（在這裡集中管理）----
export type SpiceLevel = "none" | "mild" | "medium" | "hot";

export type MenuItem = {
  title: string;
  desc: string;
  price: number;
  // 新增：供 browse 偏好篩選使用
  dietaryTags?: ("vegan" | "vegetarian" | "halal")[];
  spiceLevel?: SpiceLevel;
};

export type Chef = {
  id: string;                 // 用於 /chef/[id]
  name: string;
  avatar: string;             // /public 下的路徑，例如 /chefs/amy.jpg
  cuisine: string[];          // 菜系標籤
  location: string;           // 地區
  rating: number;             // 0–5
  priceRange: "$" | "$$" | "$$$";
  bio: string;
  gallery?: string[];
  menu: MenuItem[];           // 用來計算 "from $" 與詳情頁菜單
  dishlocate: string;
  dishes?: string[];

  // 新增（可被 browse 使用的主廚層級標記；不影響既有功能）
  capabilities?: ("vegan" | "vegetarian" | "halal")[];
  halalVerified?: boolean;

    origin?: Origin;
  regionalNotes?: string[];      // short bullets about local taste
  flavorProfile?: FlavorProfile; // 1–5 scale
  specialties?: string[];        // e.g., ["Hakka", "Night-market"]
  techniques?: string[];         // e.g., ["Knife skills – fine julienne"]
  signature?: SignatureDish[];   // 3 highlighted dishes
};

// New types
export type FlavorProfile = {
  salty: 1|2|3|4|5;
  sweet: 1|2|3|4|5;
  spicy: 1|2|3|4|5;
  herbaceous: 1|2|3|4|5; // herbs/spices freshness
  umami: 1|2|3|4|5;
  oily: 1|2|3|4|5;
};

export type SignatureDish = {
  title: string;        // must match an item already in menu.title
  shortStory: string;   // 1–2 sentences about region/technique
  regionTag?: string;   // e.g., "Tainan-sweet", "North Taiwan salty"
};

export type Origin = {
  country: string;      // e.g., "Taiwan"
  region?: string;      // e.g., "South Taiwan"
  city?: string;        // e.g., "Tainan"
};
// ---------------------------------

export const chefs: Chef[] = [
  {
    id: "amy-lin",
    name: "Amy Lin",
    avatar: "/chefs/amy-lin.jpg",
    cuisine: ["Taiwanese"],
    location: "Parramatta, NSW",
    rating: 4.7,
    priceRange: "$$",
    bio: "Home-style Taiwanese comfort dishes with seasonal veggies. Cozy meals that feel like home.",
    gallery: ["/chefs/amy-lin.jpg"],
    menu: [
      // 台式常見口味，多數不辣或微辣；豬肉/蚵等不標 halal/vegan/vegetarian
      { title: "Lu Rou Fan",        desc: "Braised pork on rice",        price: 18, dietaryTags: [],                   spiceLevel: "none"  },
      { title: "Beef Noodle Soup",  desc: "Slow-cooked broth",           price: 22, dietaryTags: [],                   spiceLevel: "mild"  },
      { title: "Three-cup Chicken", desc: "Basil, sesame oil, garlic",   price: 20, dietaryTags: [],                   spiceLevel: "mild"  },
      { title: "Gua Bao",           desc: "Pork belly bun with peanuts", price: 14, dietaryTags: [],                   spiceLevel: "none"  },
      { title: "Oyster Omelette",   desc: "Crisp edges, sweet chilli",   price: 18, dietaryTags: [],                   spiceLevel: "mild"  },
      { title: "Popcorn Chicken",   desc: "Five-spice crunchy bites",    price: 16, dietaryTags: [],                   spiceLevel: "mild"  },
    ],
    dishlocate: "/taiwanese_food",
    dishes: [
      "beef_noodle.jpg",
      "gua_bao.jpg",
      "Lu-rou-fan-with-bok-choy.jpg",
      "oyster-omelette-1200x900.jpg",
      "Stinky_Tofu.JPG",
      "taiwanese_pop_corn_chicken.jpeg",
      "three_cup_chicken.jpeg",
    ],
    capabilities: [], // 目前不特別主打
    origin: { country: "Taiwan", region: "South Taiwan", city: "Tainan" },
    regionalNotes: [
      "South Taiwan leans rounder and slightly sweet.",
      "Uses soy paste (thicker, mildly sweet) for gloss and body.",
    ],
    flavorProfile: { salty: 3, sweet: 4, spicy: 1, herbaceous: 3, umami: 5, oily: 2 },
    specialties: ["Night-market small plates", "Home-style braise", "Ban-doh banquet classics"],
    techniques: ["Sugar–soy caramel (tang-se)", "High-heat wok searing", "Knife skills – fine julienne"],
    signature: [
      { title: "Lu Rou Fan", shortStory: "Braised pork with a gentle sweet finish, Tainan-style glossy soy paste.", regionTag: "Tainan-sweet" },
      { title: "Beef Noodle Soup", shortStory: "Rich bone broth, clean spice; Taipei influence but balanced for southern palates.", regionTag: "North Taiwan salty" },
      { title: "Three-cup Chicken", shortStory: "Rice wine forward, basil aromatics; sauce reduced to a sticky sheen.", regionTag: "Island classic" },
    ],
  },
  {
    id: "raj-singh",
    name: "Raj Singh",
    avatar: "/chefs/raj-singh.jpg",
    cuisine: ["Indian", "Punjabi"],
    location: "Harris Park, NSW",
    rating: 4.6,
    priceRange: "$",
    bio: "Spice-forward North Indian meals perfect for family sharing. Hearty, generous and full of aroma.",
    gallery: ["/chefs/raj-singh.jpg"],
    menu: [
      // 素/蛋奶素與清真（肉類）並存；辣度多為 mild/medium
      { title: "Chole Bhature",   desc: "Chickpea curry with fried bread", price: 16, dietaryTags: ["vegetarian"],           spiceLevel: "mild"   },
      { title: "Butter Chicken",  desc: "Creamy tomato gravy",             price: 20, dietaryTags: ["halal"],                spiceLevel: "medium" },
      { title: "Paneer Tikka",    desc: "House-spiced cottage cheese",     price: 18, dietaryTags: ["vegetarian"],           spiceLevel: "medium" },
      { title: "Lamb Rogan Josh", desc: "Slow-cooked Kashmiri curry",      price: 22, dietaryTags: ["halal"],                spiceLevel: "medium" },
      { title: "Garlic Naan",     desc: "Tandoor-baked flatbread",         price: 5,  dietaryTags: ["vegetarian"],           spiceLevel: "none"   },
      { title: "Gulab Jamun",     desc: "Warm syrup-soaked dumplings",     price: 8,  dietaryTags: ["vegetarian"],           spiceLevel: "none"   },
    ],
    dishlocate: "/indian_food",
    dishes: [
      "chole bhature.png",
      "dabeli.png",
      "meduvada.png",
      "mohanthal.png",
      "panipuri.png",
      "khaman.png",
      "gulabjamun.png",
    ],
    capabilities: ["vegetarian", "halal"],
    halalVerified: false,
    origin: { country: "India", region: "North India", city: "Delhi" },
    regionalNotes: [
      "North Indian gravies: dairy-enriched, warm garam masala.",
      "Tandoor breads balance rich curries.",
    ],
    flavorProfile: { salty: 3, sweet: 2, spicy: 3, herbaceous: 4, umami: 4, oily: 3 },
    specialties: ["Punjabi curries", "Tandoor", "Festive sweets"],
    techniques: ["Bhuna (slow frying spice paste)", "Tandoor baking", "Tempering (tadka)"],
    signature: [
      { title: "Butter Chicken", shortStory: "Delhi-style silky tomato gravy finished with butter and kasuri methi.", regionTag: "Delhi-Punjabi" },
      { title: "Chole Bhature", shortStory: "Spiced chickpeas with fluffy fried bread; classic Delhi street breakfast.", regionTag: "Delhi street" },
      { title: "Lamb Rogan Josh", shortStory: "Kashmiri chilli aroma, yogurt base—heat is fragrant more than fiery.", regionTag: "Kashmir" },
    ],
  },
  {
    id: "maria-rossi",
    name: "Maria Rossi",
    avatar: "/chefs/maria-rossi.jpg",
    cuisine: ["Italian"],
    location: "Leichhardt, NSW",
    rating: 4.8,
    priceRange: "$$",
    bio: "Traditional Italian comfort classics from Nonna’s recipe book. Simple, honest food made with care.",
    gallery: ["/chefs/maria-rossi.jpg"],
    menu: [
      // 義式多為不辣；部份可標 vegetarian，少數可達 vegan（如不含奶的 Bruschetta）
      { title: "Lasagna al Forno",       desc: "Beef ragu & béchamel",         price: 21, dietaryTags: [],                     spiceLevel: "none" },
      { title: "Spaghetti Carbonara",    desc: "Guanciale & egg yolk sauce",    price: 19, dietaryTags: [],                     spiceLevel: "none" },
      { title: "Tiramisu",               desc: "Savoiardi & mascarpone",        price: 10, dietaryTags: ["vegetarian"],         spiceLevel: "none" },
      { title: "Margherita Pizza",       desc: "San Marzano & basil",           price: 18, dietaryTags: ["vegetarian"],         spiceLevel: "none" },
      { title: "Risotto alla Milanese",  desc: "Saffron, butter, Parmesan",     price: 21, dietaryTags: ["vegetarian"],         spiceLevel: "none" },
      { title: "Bruschetta",             desc: "Tomato, garlic, olive oil",     price: 10, dietaryTags: ["vegan"],              spiceLevel: "none" },
    ],
    dishlocate: "/Italian_food",
    dishes: [
      "download (1).jpg",
      "download (2).jpg",
      "download (3).jpg",
      "download.jpg",
      "images.jpg",
    ],
    capabilities: ["vegetarian", "vegan"],
    halalVerified: false,
    origin: { country: "Italy", region: "Central Italy", city: "Rome" },
    regionalNotes: [
      "Central Italian sauces: pecorino, guanciale, olive oil richness.",
      "Tomato forward but balanced; less garlic than southern styles.",
    ],
    flavorProfile: { salty: 3, sweet: 1, spicy: 1, herbaceous: 3, umami: 4, oily: 3 },
    specialties: ["Roman pasta", "Wood-oven pizza", "Dolci"],
    techniques: ["Emulsifying pasta water", "Dough fermentation", "Gentle zabaglione whip"],
    signature: [
      { title: "Spaghetti Carbonara", shortStory: "Roman classic—no cream, just egg, pecorino, and guanciale emulsion.", regionTag: "Rome" },
      { title: "Margherita Pizza", shortStory: "Long-fermented dough, leopard-spotted cornicione, San Marzano tomatoes.", regionTag: "Neapolitan technique" },
      { title: "Tiramisu", shortStory: "Light mascarpone mousse, espresso-soaked ladyfingers—bittersweet balance.", regionTag: "Veneto roots" },
    ],

  },
  {
    id: "sakura-tanaka",
    name: "Sakura Tanaka",
    avatar: "/chefs/sakura-tanaka.jpg",
    cuisine: ["Japanese"],
    location: "Chatswood, NSW",
    rating: 4.7,
    priceRange: "$$",
    bio: "Seasonal home-style washoku with a focus on balance and umami. Calm, nourishing meals for everyday.",
    gallery: ["/chefs/sakura-tanaka.jpg"],
    menu: [
      { title: "Sushi Set",       desc: "Chef’s choice nigiri & maki",    price: 22, dietaryTags: [],                     spiceLevel: "none"  },
      { title: "Chicken Katsu",   desc: "Panko-fried cutlet & cabbage",   price: 19, dietaryTags: [],                     spiceLevel: "none"  },
      { title: "Miso Ramen",      desc: "House broth & chashu",           price: 18, dietaryTags: [],                     spiceLevel: "mild"  },
      { title: "Okonomiyaki",     desc: "Osaka-style savoury pancake",    price: 18, dietaryTags: [],                     spiceLevel: "none"  },
      { title: "Karaage Chicken", desc: "Crispy soy-garlic bites",        price: 17, dietaryTags: [],                     spiceLevel: "none"  },
      { title: "Matcha Mochi",    desc: "Chewy green-tea dessert",        price: 8,  dietaryTags: ["vegetarian"],         spiceLevel: "none"  },
    ],
    dishlocate: "/japenese_food",
    dishes: [
      "download (4).jpg",
      "download.jpg",
      "images (1).jpg",
      "images (2).jpg",
      "images.JPG",
    ],
    capabilities: ["vegetarian"],
    halalVerified: false,
    origin: { country: "Japan", region: "Kansai", city: "Osaka" },
    regionalNotes: [
      "Kansai broths: lighter, kombu-forward dashi; soy is softer.",
      "Street classics like okonomiyaki favor sweetness–umami harmony.",
    ],
    flavorProfile: { salty: 2, sweet: 2, spicy: 1, herbaceous: 3, umami: 5, oily: 2 },
    specialties: ["Kansai okonomiyaki", "Dashi work", "Cutlet frying"],
    techniques: ["Katsu crisping (twice-fry)", "Kombu-katsuobushi dashi extraction", "Rice polishing & wash"],
    signature: [
      { title: "Okonomiyaki", shortStory: "Osaka-style savory pancake—airy batter, crisp edges, bonito finish.", regionTag: "Kansai" },
      { title: "Miso Ramen", shortStory: "House dashi blended with miso tare; clean, layered umami.", regionTag: "Hybrid style" },
      { title: "Karaage Chicken", shortStory: "Soy–ginger marinade and potato starch coat for extra crunch.", regionTag: "Izakaya classic" },
    ],

  },
  {
    id: "sofia-gomez",
    name: "Sofia Gomez",
    avatar: "/chefs/sofia-gomez.jpg",
    cuisine: ["Mexican"],
    location: "Newtown, NSW",
    rating: 4.6,
    priceRange: "$",
    bio: "Vibrant Mexican street-food favourites made at home. Bright, welcoming and fun to share.",
    gallery: ["/chefs/sofia-gomez.jpg"],
    menu: [
      { title: "Tacos al Pastor",     desc: "Marinated pork & pineapple",   price: 16, dietaryTags: [],                    spiceLevel: "medium" },
      { title: "Mole Poblano",        desc: "Rich chocolate-chilli sauce",  price: 22, dietaryTags: [],                    spiceLevel: "medium" },
      { title: "Chilaquiles",         desc: "Crispy tortilla, salsa & crema",price: 15, dietaryTags: [],                   spiceLevel: "mild"   },
      { title: "Chicken Enchiladas",  desc: "Red sauce, crema, cheese",     price: 18, dietaryTags: [],                    spiceLevel: "medium" },
      { title: "Guacamole & Chips",   desc: "Lime, coriander, fresh",       price: 12, dietaryTags: ["vegan"],             spiceLevel: "none"   },
      { title: "Tres Leches Cake",    desc: "Rich milk-soaked sponge",      price: 10, dietaryTags: ["vegetarian"],        spiceLevel: "none"   },
    ],
    dishlocate: "/Mexican",
    dishes: [
      "230321110034-03-body-mexican-foods-tamales.jpg",
      "BBQ-Corn-Hero-660x500.jpg",
      "images (1).jpeg",
      "images.jpeg",
      "Pork-carnitas-b94893e.jpg",
      "San-Pancho14.webp",
    ],
    capabilities: ["vegan", "vegetarian"],
    halalVerified: false,
    origin: { country: "Mexico", region: "Central Mexico", city: "Puebla" },
    regionalNotes: [
      "Central flavors: toasted seeds, chocolate–chilli moles, bright salsas.",
      "Corn nixtamalization drives aroma and texture.",
    ],
    flavorProfile: { salty: 3, sweet: 2, spicy: 3, herbaceous: 4, umami: 4, oily: 3 },
    specialties: ["Moles", "Nixtamal tortillas", "Street tacos"],
    techniques: ["Dry toasting (comal)", "Mole grinding", "Nixtamal masa hand-press"],
    signature: [
      { title: "Mole Poblano", shortStory: "Bittersweet depth from chillies, seeds, and a touch of chocolate.", regionTag: "Puebla" },
      { title: "Tacos al Pastor", shortStory: "Achiote-marinated pork, pineapple finish; shawarma heritage.", regionTag: "CDMX street" },
      { title: "Chilaquiles", shortStory: "Crisp tortillas tossed in salsa verde, crema and queso fresco.", regionTag: "Central brunch" },
    ],


  },
  {
    id: "ali-hassan",
    name: "Ali Hassan",
    avatar: "/chefs/ali-hassan.jpg",
    cuisine: ["Lebanese", "Middle Eastern"],
    location: "Auburn, NSW",
    rating: 4.7,
    priceRange: "$$",
    bio: "Levantine family recipes with charcoal-grilled goodness. Warm plates meant for sharing.",
    gallery: ["/chefs/ali-hassan.jpg"],
    menu: [
      { title: "Mixed Grill",               desc: "Shish tawook, kofta, lamb skewer", price: 24, dietaryTags: ["halal"],                 spiceLevel: "medium" },
      { title: "Falafel & Hummus Platter", desc: "House tahini & pickles",            price: 17, dietaryTags: ["vegan","halal"],         spiceLevel: "none"   },
      { title: "Kibbeh",                    desc: "Fried bulgur & spiced beef",       price: 18, dietaryTags: ["halal"],                 spiceLevel: "none"   },
      { title: "Chicken Shawarma Wrap",     desc: "Garlic toum & pickles",            price: 16, dietaryTags: ["halal"],                 spiceLevel: "mild"   },
      { title: "Hummus & Pita",             desc: "Creamy, nutty, fresh",             price: 12, dietaryTags: ["vegan","halal"],         spiceLevel: "none"   },
      { title: "Tabbouleh Salad",           desc: "Parsley, bulgur, lemon",           price: 14, dietaryTags: ["vegan","halal"],         spiceLevel: "none"   },
    ],
    dishlocate: "/Middle Eastern",
    dishes: [
      "17_03_03_Lebanese_Fatayer_261a.png",
      "images (1).jpeg",
      "images (2).jpeg",
      "images (3).jpeg",
      "images (4).jpeg",
      "images.jpeg",
      "lebanese-food-sfiha.jpg.webp",
      "pomegranate-chicken-24d0745.jpg",
    ],
    capabilities: ["halal", "vegan", "vegetarian"],
    halalVerified: true, // 清真菜系主打，提供「已驗證」篩選可用
    origin: { country: "Lebanon", region: "Levant", city: "Beirut" },
    regionalNotes: [
      "Levantine balance: lemon brightness, parsley freshness, tahini creaminess.",
      "Charcoal grill for smoky depth; mezze culture.",
    ],
    flavorProfile: { salty: 3, sweet: 1, spicy: 2, herbaceous: 5, umami: 4, oily: 3 },
    specialties: ["Mezze", "Charcoal grill", "Pickling"],
    techniques: ["Tahini emulsion", "Skewer shaping (kofta)", "Charred veg purée (baba ghanoush)"],
    signature: [
      { title: "Chicken Shawarma Wrap", shortStory: "Yogurt–spice marinade shaved thin; garlic toum brightens.", regionTag: "Beirut street" },
      { title: "Falafel & Hummus Platter", shortStory: "Herb-green falafel with light, silky hummus.", regionTag: "Levant mezze" },
      { title: "Kibbeh", shortStory: "Cracked wheat shell with spiced mince—baked for a gentle crust.", regionTag: "Family feast" },
    ],

  },
];

// === 在檔案最下方：保持你原本的座標補齊邏輯 ===
const CENTER = { lat: -33.8138, lng: 151.0010 }; // Parramatta CBD
const R_KM = 2.5; // 亂數半徑（公里）

function seeded(id: string) {
  // 把 id 變成 [0,1) 的穩定值
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  // 兩個不同的 0..1 值
  const a = (Math.sin(h) + 1) / 2;
  const b = (Math.sin(h * 1.7) + 1) / 2;
  return { a, b };
}

function jitterAroundParramatta(id: string) {
  const { a, b } = seeded(id);
  // 極座標：距離用 sqrt 做均勻分布，角度 0..2π
  const r = Math.sqrt(a) * R_KM;            // km
  const theta = b * Math.PI * 2;
  // km 轉經緯度（粗略）：1 deg lat ≈ 111km；lon 要乘以 cos(lat)
  const dLat = r / 111;
  const dLng = r / (111 * Math.cos((CENTER.lat * Math.PI) / 180));
  return {
    lat: CENTER.lat + dLat * Math.cos(theta),
    lng: CENTER.lng + dLng * Math.sin(theta),
  };
}

export const chefsWithGeo = chefs.map((c) =>
  (typeof (c as any).lat === "number" && typeof (c as any).lng === "number")
    ? c
    : { ...c, ...jitterAroundParramatta(c.id) }
);

export default chefs;
