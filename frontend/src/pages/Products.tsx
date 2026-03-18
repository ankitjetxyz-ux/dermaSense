import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingBag, Filter } from "lucide-react";

const CATEGORIES = ["All", "Skincare", "Makeup", "Bodycare", "Fragrance"];

const MOCK_PRODUCTS = [
  { id: 1,  name: "Hyaluronic Serum",       category: "Skincare", price: 45, tag: "Best Seller", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80", description: "Triple-weight molecules for multi-depth cellular hydration." },
  { id: 2,  name: "Vitamin C Complex",       category: "Skincare", price: 65, tag: "New",         image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80", description: "Bio-available radiance and dark-spot correction." },
  { id: 3,  name: "Matte Foundation",        category: "Makeup",   price: 52, tag: "",            image: "https://images.unsplash.com/photo-1596704017254-9b121068f044?auto=format&fit=crop&w=600&q=80", description: "Invisible coverage with a skin-second-skin finish." },
  { id: 4,  name: "Body Oil Tint",           category: "Bodycare", price: 38, tag: "",            image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80", description: "Structural luster meets deep nourishment." },
  { id: 5,  name: "Niacinamide Toner",       category: "Skincare", price: 34, tag: "Best Seller", image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?auto=format&fit=crop&w=600&q=80", description: "Pore refinement and barrier-restoring complex." },
  { id: 6,  name: "Satin Lip Treatment",     category: "Makeup",   price: 22, tag: "New",         image: "https://images.unsplash.com/photo-1631730486134-c99a59e2ebea?auto=format&fit=crop&w=600&q=80", description: "Tinted moisture for defined, supple lips." },
  { id: 7,  name: "Peptide Eye Cream",       category: "Skincare", price: 72, tag: "",            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80", description: "Firming peptide complex for the periorbital zone." },
  { id: 8,  name: "Rose Facial Mist",        category: "Skincare", price: 28, tag: "",            image: "https://images.unsplash.com/photo-1607748851687-ba9a10438621?auto=format&fit=crop&w=600&q=80", description: "Antioxidant hydration reset throughout the day." },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const preSelected = searchParams.get("category") ?? "All";

  const [selectedCategory, setSelectedCategory] = useState(
    CATEGORIES.includes(preSelected) ? preSelected : "All"
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy]  = useState<"default" | "low" | "high">("default");
  useEffect(() => {
    if (CATEGORIES.includes(preSelected)) setSelectedCategory(preSelected);
  }, [preSelected]);

  let filtered = MOCK_PRODUCTS
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  if (sortBy === "low")  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header banner */}
        <div className="bg-rose-light/40 border-b border-border/50 py-14 text-center">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.3em] text-accent block mb-3">Collection</span>
          <h1 className="font-display text-5xl md:text-7xl italic text-foreground">The Catalog</h1>
        </div>

        {/* Filters bar */}
        <div className="border-b border-border/50 bg-background sticky top-[65px] z-30">
          <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 justify-between">
            {/* Categories */}
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-body text-[11px] font-medium uppercase tracking-[0.18em] whitespace-nowrap pb-0.5 border-b-2 transition-all ${
                    selectedCategory === cat ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search + sort */}
            <div className="flex items-center gap-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="font-body text-[11px] border-b border-border bg-transparent outline-none py-1 w-36 focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
              />
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="font-body text-[11px] bg-transparent text-muted-foreground outline-none cursor-pointer"
                >
                  <option value="default">Sort</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="container mx-auto px-6 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl italic text-muted-foreground">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="group bg-card border border-border/50 flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-secondary/40">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground font-body text-[9px] uppercase tracking-widest px-2 py-1">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="font-display text-xl italic text-foreground mb-2">{product.name}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                      <span className="font-body text-sm font-medium text-foreground">${product.price}</span>
                      <button
                        onClick={(e) => { e.preventDefault(); }}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-body text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all"
                      >
                        <ShoppingBag className="h-3 w-3" /> Add
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
