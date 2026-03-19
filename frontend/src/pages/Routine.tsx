import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/lib/api";
import { Check } from "lucide-react";
import { getCurrentUser, saveLocalProfile } from "@/lib/session";

const skinTypeOptions = [
  { value: "Dry",         desc: "Tight, flaky or rough texture" },
  { value: "Oily",        desc: "Shiny, enlarged pores" },
  { value: "Combination", desc: "Oily T-zone, dry cheeks" },
  { value: "Normal",      desc: "Balanced with minimal issues" },
  { value: "Sensitive",   desc: "Reactive, prone to redness" },
];

const concernOptions = [
  { value: "Hydration",     emoji: "💧" },
  { value: "Glow",          emoji: "✨" },
  { value: "Acne",          emoji: "🌿" },
  { value: "Anti-Aging",    emoji: "🕰️" },
  { value: "Hyperpigmentation", emoji: "🔆" },
  { value: "Sensitivity",   emoji: "🤍" },
];

const STEPS  = ["skin_type", "concern", "confirm"] as const;
type Step    = typeof STEPS[number];

const Routine = () => {
  const [step, setStep]         = useState<Step>("skin_type");
  const [skinType, setSkinType] = useState("");
  const [concern, setConcern]   = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const progress = { skin_type: 33, concern: 66, confirm: 100 }[step];

  const handleSubmit = async () => {
    const user = getCurrentUser();
    const userId = user?.id ?? 1;

    setLoading(true);
    try {
      await api.post("/skin-profiles", { skinType, concern, userId });
    } catch (err) {
      saveLocalProfile({ skinType, concern, userId });
      console.error(err);
    }
    setLoading(false);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 md:py-28 animate-fade-in">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto">

            {/* Header */}
            <div className="text-center mb-12">
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-accent font-medium block mb-4">Personalised Diagnostics</span>
              <h1 className="font-display text-5xl md:text-6xl text-foreground mb-2">Routine Finder</h1>
              <p className="font-body text-sm text-muted-foreground">Tell us about your skin so we can build your perfect routine.</p>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-border/60 mb-10 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step: Skin Type */}
            {step === "skin_type" && (
              <div className="space-y-4 ds-card p-5 md:p-6">
                <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-6">Step 1 of 2 — What is your skin type?</p>
                {skinTypeOptions.map(({ value, desc }) => (
                  <button
                    key={value}
                    onClick={() => setSkinType(value)}
                    className={`w-full flex items-center justify-between border px-6 py-4 text-left transition-all ${
                      skinType === value
                        ? "bg-rose-light border-primary text-foreground rounded-xl"
                        : "border-border/60 hover:border-primary/50 hover:bg-rose-light/30 text-foreground"
                    }`}
                  >
                    <div>
                      <p className="font-body text-sm font-medium">{value}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                    {skinType === value && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </button>
                ))}
                <div className="flex justify-end pt-4">
                  <button
                    disabled={!skinType}
                    onClick={() => setStep("concern")}
                    className="bg-primary text-primary-foreground px-10 py-3 font-body text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-primary/90 transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step: Concern */}
            {step === "concern" && (
              <div className="ds-card p-5 md:p-6">
                <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-6">Step 2 of 2 — What is your primary concern?</p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {concernOptions.map(({ value, emoji }) => (
                    <button
                      key={value}
                      onClick={() => setConcern(value)}
                      className={`flex items-center gap-3 border rounded-xl px-5 py-4 transition-all ${
                        concern === value
                          ? "bg-rose-light border-primary"
                          : "border-border/60 hover:border-primary/50 hover:bg-rose-light/30"
                      }`}
                    >
                      <span className="text-xl">{emoji}</span>
                      <div className="text-left">
                        <p className="font-body text-sm font-medium text-foreground">{value}</p>
                      </div>
                      {concern === value && <Check className="h-4 w-4 text-primary ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => setStep("skin_type")} className="font-body text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                    ← Back
                  </button>
                  <button
                    disabled={!concern}
                    onClick={() => setStep("confirm")}
                    className="bg-primary text-primary-foreground px-10 py-3 font-body text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-primary/90 transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step: Confirm */}
            {step === "confirm" && (
              <div className="ds-card p-10 text-center space-y-6">
                <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">Your Skin Profile</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rose-light/50 p-5">
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Skin Type</p>
                    <p className="font-display text-2xl text-foreground">{skinType}</p>
                  </div>
                  <div className="bg-sage-light/50 p-5">
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Main Concern</p>
                    <p className="font-display text-2xl text-foreground">{concern}</p>
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground">We'll save this to build your personalised routine recommendations.</p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
                  <button onClick={() => setStep("skin_type")} className="font-body text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                    Start over
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-primary rounded-xl text-primary-foreground px-12 py-4 font-body text-[11px] uppercase tracking-widest disabled:opacity-60 hover:bg-primary/90 transition-all"
                  >
                    {loading ? "Saving..." : "Save My Routine"}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-10 text-center">
              <Link to="/products" className="font-body text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                Skip — Browse all products
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Routine;
