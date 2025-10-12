// /app/data/quiz.ts
export type QuizQuestion = {
  id: string;
  imageUrl: string;
  questionType: "cuisine" | "dish";
  questionText: string;
  options: string[];
  correctIndex: number;
  story: string; // ~70–110 words (short)
  voucherOnCorrect?: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1-zongzi",
    imageUrl: "/quiz/CN-zongzi.jpg",
    questionType: "dish",
    questionText: "What is the correct name of this dish?",
    options: ["Zongzi", "Onigiri", "Bánh chưng", "Momo"],
    correctIndex: 0,
    story:
      "Zongzi are sticky-rice parcels wrapped in bamboo or reed leaves, most associated with the Dragon Boat Festival. Legend links them to the poet Qu Yuan, but today they are everyday comfort food. Regional styles vary: eastern China has sweet fillings like red bean or jujube, while Guangdong and Taiwan favor savory ones such as braised pork, shiitake, peanuts, or salted egg yolk. Shapes differ by region too. As they steam, the leaf aroma infuses the rice, and unwrapping one releases a warm, homey scent.",
    voucherOnCorrect: "CC-DEMO-5OFF",
  },
  {
    id: "q2-ramen",
    imageUrl: "/quiz/JP-ramen.jpg",
    questionType: "cuisine",
    questionText: "This dish most likely belongs to which cuisine?",
    options: ["Japanese", "Thai", "Malaysian", "Korean"],
    correctIndex: 0,
    story:
      "Ramen balances broth, noodles, toppings, and aroma oils. Styles map to regions: Hakata tonkotsu is rich and milky; Sapporo miso is hearty and warming; classic Tokyo bowls lean clear soy. Timing matters—long-simmered bones and aromatics, noodles cooked to the second, and chashu that softens just enough. Street carts after WWII evolved into neighborhood shops and global cult favorites. Slurping isn’t rude—it cools noodles, aerates the broth, and signals simple joy.",
    voucherOnCorrect: "CC-DEMO-NOODLE10",
  },
  {
    id: "q3-biryani",
    imageUrl: "/quiz/IN-biryani.jpg",
    questionType: "dish",
    questionText: "What is this layered, spice-forward rice dish called?",
    options: ["Biryani", "Paella", "Jollof Rice", "Pilaf"],
    correctIndex: 0,
    story:
      "Biryani layers basmati rice with marinated meat or vegetables and whole spices like cardamom, clove, bay leaf, and saffron. In Hyderabad, the kacchi style nests raw, marinated meat with par-cooked rice; in Lucknow, components are cooked first, then steamed together. Sealing the pot traps fragrant vapor, so lifting the lid releases saffron, ghee, and meat aromas. It’s a celebratory dish that turns kitchens into gathering places.",
    voucherOnCorrect: "CC-DEMO-SPICE7",
  },
  {
    id: "q4-alpastor",
    imageUrl: "/quiz/MX-alpastor.jpg",
    questionType: "dish",
    questionText: "What is the name of this taco style, with spit-roasted marinated pork?",
    options: ["Tacos al Pastor", "Carne Asada Tacos", "Barbacoa Tacos", "Carnitas Tacos"],
    correctIndex: 0,
    story:
      "Tacos al pastor mix Mexican street flavor with a Levantine spit-roasting technique. Pork is marinated with chilies and achiote, stacked on a vertical trompo, and shaved crisp onto warm corn tortillas. Typical toppings are onion, cilantro, salsa, and often a sliver of grilled pineapple. The result is smoky, tangy, and slightly sweet—perfect for late-night bites and quick, hot service at a stand.",
    voucherOnCorrect: "CC-DEMO-TACO6",
  },
  {
    id: "q5-pierogi",
    imageUrl: "/quiz/PL-pierogi.jpg",
    questionType: "cuisine",
    questionText: "These dumplings are most closely associated with which cuisine?",
    options: ["Polish", "Greek", "Turkish", "Portuguese"],
    correctIndex: 0,
    story:
      "Pierogi are filled dumplings central to Polish home cooking, with cousins across Central and Eastern Europe. Dough rounds are folded over fillings like potato and farmer’s cheese (ruskie), sauerkraut and mushrooms, minced meat, or sweet fruits. Boiled until they float—and often pan-fried in butter—they’re finished with caramelized onions or sour cream. Making pierogi is a family ritual: forming crescents, sealing edges, and stacking trays for sharing.",
    voucherOnCorrect: "CC-DEMO-DOUGH4",
  },
];
