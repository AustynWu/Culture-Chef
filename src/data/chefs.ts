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
};
// ---------------------------------

export const chefs: Chef[] = [
  {
    id: "amy-lin",
    name: "Amy Lin",
    avatar: "/chefs/amy-lin.jpg",
    cuisine: ["Taiwanese", "Chinese"],
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
