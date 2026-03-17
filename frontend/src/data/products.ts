export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  skinTypes: string[];
  emoji: string;
}

export const products: Product[] = [
  { id: 1, name: "Hydrating Cleanser", brand: "CeraVe", category: "Cleanser", price: 14.99, rating: 4.7, skinTypes: ["dry", "normal", "sensitive"], emoji: "🧴" },
  { id: 2, name: "Niacinamide Serum", brand: "The Ordinary", category: "Serum", price: 6.50, rating: 4.5, skinTypes: ["oily", "combination"], emoji: "💧" },
  { id: 3, name: "SPF 50 Sunscreen", brand: "La Roche-Posay", category: "Sunscreen", price: 19.99, rating: 4.8, skinTypes: ["all"], emoji: "☀️" },
  { id: 4, name: "Retinol Night Cream", brand: "Neutrogena", category: "Moisturizer", price: 22.99, rating: 4.3, skinTypes: ["normal", "combination"], emoji: "🌙" },
  { id: 5, name: "Salicylic Acid Wash", brand: "Paula's Choice", category: "Cleanser", price: 10.99, rating: 4.6, skinTypes: ["oily", "combination"], emoji: "✨" },
  { id: 6, name: "Vitamin C Serum", brand: "Timeless", category: "Serum", price: 15.99, rating: 4.4, skinTypes: ["all"], emoji: "🍊" },
  { id: 7, name: "Centella Moisturizer", brand: "COSRX", category: "Moisturizer", price: 18.50, rating: 4.7, skinTypes: ["sensitive", "dry"], emoji: "🌿" },
  { id: 8, name: "Clay Mask", brand: "Innisfree", category: "Mask", price: 12.99, rating: 4.5, skinTypes: ["oily"], emoji: "🎭" },
  { id: 9, name: "Hyaluronic Acid", brand: "The Ordinary", category: "Serum", price: 7.99, rating: 4.6, skinTypes: ["dry", "normal"], emoji: "💦" },
  { id: 10, name: "Oil-Free Moisturizer", brand: "Cetaphil", category: "Moisturizer", price: 13.49, rating: 4.4, skinTypes: ["oily", "combination"], emoji: "🧊" },
  { id: 11, name: "Aloe Vera Gel", brand: "Nature Republic", category: "Moisturizer", price: 8.99, rating: 4.3, skinTypes: ["sensitive", "all"], emoji: "🌱" },
  { id: 12, name: "AHA/BHA Toner", brand: "COSRX", category: "Toner", price: 11.99, rating: 4.5, skinTypes: ["oily", "combination", "normal"], emoji: "⚗️" },
];
