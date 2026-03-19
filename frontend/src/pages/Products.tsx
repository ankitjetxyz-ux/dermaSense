import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingBag, Filter } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { addToCart } from "@/lib/session";

const Products = () => {
  const [searchParams] = useSearchParams();
  const preSelected = searchParams.get("category") ?? "All";
  const query = searchParams.get("q") ?? "";
  const isCategory = (value: string): value is (typeof CATEGORIES)[number] =>
    CATEGORIES.some((category) => category === value);

  const [selectedCategory, setSelectedCategory] = useState(
    isCategory(preSelected) ? preSelected : "All"
  );
  const [search, setSearch] = useState(query);
  const [sortBy, setSortBy]  = useState<"default" | "low" | "high">("default");
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    if (isCategory(preSelected)) {
      setSelectedCategory(preSelected);
    }
    setSearch(query);
  }, [preSelected, query]);

  let filtered = PRODUCTS
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
          <h1 className="font-display text-5xl md:text-7xl text-foreground">The Catalog</h1>
        </div>

        {/* Filters bar */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-[88px] z-30">
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
                className="font-body text-[11px] border border-border/70 rounded-full bg-background px-3 py-1.5 w-40 focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
              />
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="font-body text-[11px] bg-transparent text-muted-foreground outline-none cursor-pointer border border-border/60 rounded-full px-3 py-1"
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
                  className="group ds-card flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
                    <h3 className="font-display text-xl text-foreground mb-2">{product.name}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                      <span className="font-body text-sm font-medium text-foreground">${product.price}</span>
                      <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                              setAddedId(product.id);
                              window.dispatchEvent(new Event("cart-updated"));
                              window.setTimeout(() => setAddedId(null), 900);
                            }}
                        className="flex items-center gap-2 bg-primary rounded-lg text-primary-foreground px-4 py-2 font-body text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all"
                      >
                            <ShoppingBag className="h-3 w-3" />
                            {addedId === product.id ? "Added" : "Add"}
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
