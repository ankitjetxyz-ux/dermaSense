import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Activity, User as UserIcon, Plus, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";

interface SkinProfile {
  id: number;
  skinType: string;
  concern: string;
}

const concernColor: Record<string, string> = {
  "Hydration":           "bg-blue-50  border-blue-200",
  "Glow":                "bg-yellow-50 border-yellow-200",
  "Acne":                "bg-green-50  border-green-200",
  "Anti-Aging":          "bg-purple-50 border-purple-200",
  "Hyperpigmentation":   "bg-orange-50 border-orange-200",
  "Sensitivity":         "bg-rose-50   border-rose-200",
};

const Profile = () => {
  const [profiles, setProfiles] = useState<SkinProfile[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get("/skin-profiles/user/1")
      .then(setProfiles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-14 animate-fade-in">
        <div className="container mx-auto px-6 max-w-3xl">

          {/* User hero */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-14 pb-12 border-b border-border/50">
            <div className="w-20 h-20 bg-rose-light flex items-center justify-center border border-border/50 shrink-0">
              <UserIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-4xl italic text-foreground mb-1">My Profile</h1>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">Diagnostics Archive</p>
            </div>
            <Link
              to="/routine"
              className="sm:ml-auto flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-body text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> New Diagnostic
            </Link>
          </div>

          {/* Profiles section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <FlaskConical className="h-4 w-4 text-accent" />
              <h2 className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">Saved Skin Profiles</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="border border-border/40 p-7 animate-pulse bg-secondary/30 h-20" />
                ))}
              </div>
            ) : profiles.length === 0 ? (
              <div className="border border-border/50 p-16 text-center bg-secondary/20">
                <FlaskConical className="h-10 w-10 text-muted-foreground/30 mx-auto mb-6" />
                <p className="font-display text-2xl italic text-muted-foreground mb-3">No diagnostics yet.</p>
                <p className="font-body text-xs text-muted-foreground mb-8">Take our skin diagnostic to get a personalised routine recommendation.</p>
                <Link to="/routine" className="bg-primary text-primary-foreground px-8 py-3 font-body text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all">
                  Start Diagnostic
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className={`border p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:-translate-y-0.5 hover:shadow-sm ${concernColor[p.concern] ?? "bg-secondary/20 border-border/50"}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 bg-background/80 flex items-center justify-center border border-border/40 shrink-0">
                        <Activity className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Profile #{p.id}</p>
                        <h3 className="font-display text-xl italic text-foreground">{p.concern}</h3>
                        <p className="font-body text-xs text-muted-foreground">Skin type: {p.skinType}</p>
                      </div>
                    </div>
                    <Link
                      to="/products"
                      className="font-body text-[10px] uppercase tracking-widest text-primary underline underline-offset-4 hover:text-primary/80 transition-colors shrink-0"
                    >
                      View Recommendations →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
