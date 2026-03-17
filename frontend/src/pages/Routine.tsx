import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Routine = () => {
  return (
    <div className="gradient-bg flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto flex-1 px-6 py-10 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="gradient-text text-4xl md:text-5xl font-black tracking-tight">
            Skin Routine Finder
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Answer a quick cosmetic + skincare quiz to get routine and product matches.
          </p>
        </div>

        <div className="mt-8">
          <div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold tracking-widest text-muted-foreground">
                  QUIZ (UI DEMO)
                </div>
                <div className="text-xs text-muted-foreground">Step 1 / 15</div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/4" style={{ background: "var(--gradient-primary)" }} />
              </div>

              <div className="mt-6 text-xl md:text-2xl font-black text-foreground">
                What describes your main goal right now?
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["Hydration", "Glow", "Acne care", "Oil control"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="rounded-xl border border-border bg-card px-4 py-4 text-left font-semibold text-white transition hover:bg-white/10"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Link to="/products" className="btn-outline">
                  Skip to products
                </Link>
                <button type="button" className="btn-gradient px-6 py-3 text-sm">
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Routine;
