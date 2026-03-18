import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const Products = () => {
  const [search, setSearch] = useState("");

  const products = useMemo(
    () =>
      [
        {
          id: "p-1",
          brand: "DermaSense",
          name: "Hydrating Cleanser",
          category: "Skincare",
          img: "https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-2",
          brand: "DermaSense",
          name: "Niacinamide Serum",
          category: "Skincare",
          img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-3",
          brand: "DermaSense",
          name: "Barrier Moisturizer",
          category: "Skincare",
          img: "https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-4",
          brand: "DermaSense",
          name: "SPF 50 Sunscreen",
          category: "Skincare",
          img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-5",
          brand: "Bloom",
          name: "Velvet Matte Lipstick",
          category: "Makeup",
          img: "https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-6",
          brand: "Bloom",
          name: "Soft Blush Compact",
          category: "Makeup",
          img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-7",
          brand: "Aura",
          name: "Dewy Foundation",
          category: "Makeup",
          img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-8",
          brand: "Aura",
          name: "Volume Mascara",
          category: "Makeup",
          img: "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-9",
          brand: "Silk",
          name: "Repair Shampoo",
          category: "Haircare",
          img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-10",
          brand: "Silk",
          name: "Smoothing Conditioner",
          category: "Haircare",
          img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-11",
          brand: "Mist",
          name: "Daily Body Lotion",
          category: "Bodycare",
          img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "p-12",
          brand: "Mist",
          name: "Soft Hand Cream",
          category: "Bodycare",
          img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
        },
      ],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div className="gradient-bg flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto flex-1 px-6 py-10 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="gradient-text text-4xl md:text-5xl font-black tracking-tight">
            Products
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Shop cosmetics and skincare with a Myntra-like browsing experience (demo).
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 px-4 py-3 md:w-[520px]">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, brands or categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/60 outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {["Skincare", "Makeup", "Haircare", "Bodycare", "Fragrance"].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5"
            >
              <div className="aspect-square overflow-hidden bg-muted/20">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="text-xs font-bold tracking-widest text-muted-foreground">
                  {p.brand.toUpperCase()}
                </div>
                <div className="mt-1 font-extrabold text-foreground">{p.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{p.category}</div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">₹{(999 + p.id.length * 37) % 1999}</span>
                  <button type="button" className="btn-gradient px-4 py-2 text-xs">
                    ADD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No products found.</p>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default Products;
