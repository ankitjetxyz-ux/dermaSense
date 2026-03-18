import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";

const Index = () => {
  return (
    <div className="gradient-bg flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto flex-1 px-6">
        <section className="py-8 md:py-10 animate-fade-in">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="gradient-text text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              DermaSense
            </h1>
            <p className="mt-4 text-base font-bold leading-snug text-white sm:text-lg md:mt-5 md:text-xl">
              Stop guessing. Start glowing. DermaSense matches your skin type, concerns, and goals to the products that actually work for you.
            </p>
          </div>

          <div className="mt-10">
            <HeroCarousel />
          </div>

          <div className="mt-8 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="gradient-text text-2xl font-black tracking-tight md:text-3xl">
                Skincare, but smarter.
              </h2>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                Discover routines and curated products designed for real skin.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/routine" className="btn-gradient text-sm md:text-base">
                Find My Routine →
              </Link>
              <Link to="/products" className="btn-outline text-sm md:text-base">
                Shop Products
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                title: "Makeup",
                img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80",
              },
              {
                title: "Skincare",
                img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1400&q=80",
              },
              {
                title: "Haircare",
                img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1400&q=80",
              },
              {
                title: "Fragrance",
                img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80",
              },
            ].map((c) => (
              <Link
                key={c.title}
                to="/products"
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-bold tracking-wide text-white">{c.title}</div>
                  <div className="mt-1 text-xs text-white/70">Explore</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
