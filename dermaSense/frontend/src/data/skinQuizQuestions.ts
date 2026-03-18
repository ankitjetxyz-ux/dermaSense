export interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; value: string }[];
}

export const skinQuizQuestions: QuizQuestion[] = [
  { id: 1, question: "How does your skin feel after washing your face?", options: [{ label: "Tight and dry", value: "dry" }, { label: "Smooth and comfortable", value: "normal" }, { label: "Oily within an hour", value: "oily" }, { label: "Dry in some areas, oily in others", value: "combination" }] },
  { id: 2, question: "How often do you experience breakouts?", options: [{ label: "Rarely", value: "dry" }, { label: "Occasionally", value: "normal" }, { label: "Frequently", value: "oily" }, { label: "Only in certain areas", value: "combination" }] },
  { id: 3, question: "How does your skin react to new products?", options: [{ label: "It gets red or irritated easily", value: "sensitive" }, { label: "No reaction usually", value: "normal" }, { label: "Sometimes breaks out", value: "oily" }, { label: "Depends on the area", value: "combination" }] },
  { id: 4, question: "What's your biggest skin concern?", options: [{ label: "Dryness and flaking", value: "dry" }, { label: "Uneven texture", value: "normal" }, { label: "Excess shine and pores", value: "oily" }, { label: "Redness and sensitivity", value: "sensitive" }] },
  { id: 5, question: "How would you describe your pores?", options: [{ label: "Almost invisible", value: "dry" }, { label: "Small and even", value: "normal" }, { label: "Large and visible", value: "oily" }, { label: "Larger on nose/forehead", value: "combination" }] },
  { id: 6, question: "How does your skin feel by midday?", options: [{ label: "Still dry", value: "dry" }, { label: "Comfortable", value: "normal" }, { label: "Very shiny", value: "oily" }, { label: "T-zone is oily, cheeks are fine", value: "combination" }] },
  { id: 7, question: "How does sun exposure affect your skin?", options: [{ label: "Burns easily", value: "sensitive" }, { label: "Tans gradually", value: "normal" }, { label: "Tans easily", value: "oily" }, { label: "Burns in some spots", value: "dry" }] },
  { id: 8, question: "Do you experience skin tightness in winter?", options: [{ label: "Yes, a lot", value: "dry" }, { label: "Slightly", value: "normal" }, { label: "Not really", value: "oily" }, { label: "Only on cheeks", value: "combination" }] },
  { id: 9, question: "How often do you moisturize?", options: [{ label: "Multiple times a day", value: "dry" }, { label: "Once daily", value: "normal" }, { label: "Rarely, it feels greasy", value: "oily" }, { label: "Only dry areas", value: "combination" }] },
  { id: 10, question: "What best describes your skin tone evenness?", options: [{ label: "Patchy and uneven", value: "dry" }, { label: "Generally even", value: "normal" }, { label: "Shiny but even", value: "oily" }, { label: "Dark spots in places", value: "combination" }] },
  { id: 11, question: "Do you have visible fine lines?", options: [{ label: "Yes, especially around eyes", value: "dry" }, { label: "Very few", value: "normal" }, { label: "No", value: "oily" }, { label: "In dry areas only", value: "combination" }] },
  { id: 12, question: "How does your makeup wear?", options: [{ label: "It flakes off", value: "dry" }, { label: "Stays well all day", value: "normal" }, { label: "Slides off by noon", value: "oily" }, { label: "Fades unevenly", value: "combination" }] },
  { id: 13, question: "How does your skin react to stress?", options: [{ label: "Gets dry and flaky", value: "dry" }, { label: "No change", value: "normal" }, { label: "Breaks out", value: "oily" }, { label: "Gets red or irritated", value: "sensitive" }] },
  { id: 14, question: "What's your water intake like?", options: [{ label: "Less than 4 glasses", value: "dry" }, { label: "6-8 glasses", value: "normal" }, { label: "More than 8 glasses", value: "oily" }, { label: "It varies a lot", value: "combination" }] },
  { id: 15, question: "How old are you?", options: [{ label: "Under 20", value: "oily" }, { label: "20-30", value: "normal" }, { label: "30-45", value: "combination" }, { label: "45+", value: "dry" }] },
];

export type SkinType = "dry" | "oily" | "normal" | "combination" | "sensitive";

export const skinTypeDescriptions: Record<SkinType, { title: string; description: string; tips: string[] }> = {
  dry: {
    title: "Dry Skin",
    description: "Your skin tends to feel tight and may flake. It needs extra hydration and gentle care.",
    tips: ["Use a rich, cream-based moisturizer", "Avoid hot water when cleansing", "Look for hyaluronic acid and ceramides", "Apply SPF daily"],
  },
  oily: {
    title: "Oily Skin",
    description: "Your skin produces excess sebum, leading to shine and potential breakouts.",
    tips: ["Use a gel-based or lightweight moisturizer", "Try niacinamide serums", "Don't skip moisturizer", "Use clay masks weekly"],
  },
  normal: {
    title: "Normal Skin",
    description: "Your skin is well-balanced with minimal concerns. Lucky you!",
    tips: ["Maintain with a simple routine", "Use antioxidant serums", "Stay hydrated", "Wear sunscreen daily"],
  },
  combination: {
    title: "Combination Skin",
    description: "Your T-zone tends to be oily while your cheeks stay dry. You need a balanced approach.",
    tips: ["Use different products for different zones", "Try a balancing toner", "Use lightweight gel moisturizers", "Exfoliate gently 2x/week"],
  },
  sensitive: {
    title: "Sensitive Skin",
    description: "Your skin reacts easily to products and environmental factors. Gentle care is key.",
    tips: ["Use fragrance-free products", "Patch test new products", "Look for centella and aloe", "Avoid harsh exfoliants"],
  },
};
