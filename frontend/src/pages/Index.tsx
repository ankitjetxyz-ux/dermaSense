import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Leaf, FlaskConical, Sparkles, ShieldCheck } from "lucide-react";

const featuredCategories = [
  { name: "Serums",     desc: "Targeted actives",   img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80" },
  { name: "Moisturisers", desc: "Barrier support",  img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80" },
  { name: "Sunscreen",  desc: "Daily protection",   img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" },
];

const values = [
  { icon: Leaf,         label: "Clean Formula",    desc: "No harmful additives" },
  { icon: FlaskConical, label: "Clinically Tested", desc: "Dermatologist validated" },
  { icon: Sparkles,     label: "Skin-Matched",      desc: "Personalised routines" },
  { icon: ShieldCheck,  label: "Transparent",       desc: "Every ingredient disclosed" },
];

const Index = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />

    <main className="flex-1">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/50 py-20 md:py-36">
        {/* Decorative blush blob */}
        <div className="pointer-events-none absolute top-0 right-0 w-[55vw] h-full bg-rose-light opacity-40" />
        <div className="pointer-events-none absolute -bottom-20 -left-24 w-72 h-72 rounded-full bg-sage-light blur-3xl opacity-50" />

        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-16">
            {/* Copy */}
            <div className="flex-1 max-w-lg animate-fade-in">
              <span className="inline-block font-body text-[10px] font-medium uppercase tracking-[0.35em] text-accent mb-6 bg-sage-light px-3 py-1">
                Science-Led Skincare
              </span>
              <h1 className="font-display text-6xl md:text-8xl italic leading-[0.9] text-foreground mb-8">
                Skin that<br/>
                <em className="not-italic text-primary">knows</em><br/>
                itself.
              </h1>
              <p className="font-body text-sm text-muted-foreground max-w-sm leading-relaxed">
                Advanced diagnostics and botanically-backed formulations curated to your skin's unique biology.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/routine" className="bg-primary text-primary-foreground px-10 py-4 font-body text-[11px] font-medium uppercase tracking-widest hover:bg-primary/90 transition-all text-center">
                  Get My Routine
                </Link>
                <Link to="/products" className="border border-primary/40 text-primary px-10 py-4 font-body text-[11px] font-medium uppercase tracking-widest hover:bg-rose-light transition-all text-center">
                  Explore Catalog
                </Link>
              </div>
            </div>

            {/* Hero image */}
            <div className="flex-1 w-full max-w-md animate-fade-in animate-delay-100">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1000&q=80"
                  alt="Skincare ritual"
                  className="w-full h-full object-cover"
                />
                {/* Overlay badge */}
                <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm p-4 border border-border/50">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Personalised for</p>
                  <p className="font-display text-xl italic text-foreground">Your Skin Type</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category tiles ────────────────────────── */}
      <section className="border-b border-border/50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl italic text-foreground mb-10">Featured Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="group relative aspect-[4/3] overflow-hidden"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-all" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-display text-2xl italic text-white">{cat.name}</h3>
                  <p className="font-body text-[10px] uppercase tracking-widest text-white/70">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values strip ─────────────────────────── */}
      <section className="bg-rose-light/30 py-14 border-b border-border/50">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {values.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 bg-background flex items-center justify-center border border-border/50">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="font-display text-lg italic text-foreground">{label}</p>
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Index;
