import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="gradient-bg flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto flex-1 px-6 py-10 animate-fade-in">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="gradient-text text-4xl md:text-5xl font-black tracking-tight">
              Profile
            </h1>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              View your routine status, saves, and orders (UI demo).
            </p>
          </div>
          <Link to="/products" className="btn-outline hidden sm:inline-flex">
            Continue shopping
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-border">
                  <img
                    src="https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=300&q=80"
                    alt="User"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold tracking-widest text-muted-foreground">DERMASENSE</div>
                  <div className="mt-1 text-lg font-extrabold text-foreground">Guest User</div>
                  <div className="mt-1 text-sm text-muted-foreground">Skin type: Not assessed</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { k: "Orders", v: "0" },
                  { k: "Wishlist", v: "0" },
                  { k: "Quiz", v: "0/15" },
                  { k: "Saved", v: "0" },
                ].map((x) => (
                  <div key={x.k} className="rounded-xl border border-border bg-muted/20 p-4">
                    <div className="text-xs font-bold tracking-widest text-muted-foreground">
                      {x.k.toUpperCase()}
                    </div>
                    <div className="mt-1 text-lg font-extrabold text-foreground">{x.v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Link to="/routine" className="btn-gradient w-full px-6 py-3 text-sm text-center">
                  Start routine →
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold tracking-widest text-muted-foreground">RECOMMENDED</div>
                  <div className="mt-2 text-2xl font-black text-foreground">Your picks</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Based on your routine and browsing (demo).
                  </div>
                </div>
                <Link
                  to="/products"
                  className="btn-outline px-4 py-2"
                >
                  View all
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    name: "Niacinamide Serum",
                    brand: "DermaSense",
                    img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=80",
                  },
                  {
                    name: "Velvet Matte Lipstick",
                    brand: "Bloom",
                    img: "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=600&q=80",
                  },
                  {
                    name: "SPF 50 Sunscreen",
                    brand: "DermaSense",
                    img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
                  },
                ].map((p) => (
                  <Link
                    key={p.name}
                    to="/products"
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5"
                  >
                    <div className="aspect-square overflow-hidden">
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
                      <div className="mt-1 text-sm text-muted-foreground">Curated for you</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
