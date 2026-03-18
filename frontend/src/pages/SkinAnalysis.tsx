import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Sparkles, CheckCircle, Loader2, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

// ─── Questionnaire definition ────────────────────────────────────
const QUESTIONS = [
  {
    id: "texture",
    question: "How does your skin feel about 2 hours after washing?",
    options: [
      { label: "Tight and dry",          value: "tight and very dry, possibly flaking" },
      { label: "Smooth and comfortable", value: "comfortable — balanced, neither oily nor dry" },
      { label: "Oily all over",          value: "oily and shiny across the whole face" },
      { label: "Oily in the T-zone only",value: "oily on the forehead, nose and chin but dry on the cheeks" },
      { label: "Redness or irritation",  value: "red, tight or irritated — very reactive" },
    ],
  },
  {
    id: "pores",
    question: "How would you describe your pores?",
    options: [
      { label: "Barely visible",                     value: "barely visible — small and tight" },
      { label: "Visible but not large",              value: "visible but not enlarged" },
      { label: "Large and often clogged",            value: "enlarged and prone to blackheads or clogs" },
      { label: "Large in T-zone, small on cheeks",   value: "large in the T-zone but small or invisible on cheeks" },
    ],
  },
  {
    id: "breakouts",
    question: "How often do you experience breakouts?",
    options: [
      { label: "Rarely or never",          value: "rarely or never" },
      { label: "Occasionally",             value: "occasionally, usually linked to stress or hormones" },
      { label: "Regularly",                value: "regularly — frequent pimples, blackheads or whiteheads" },
      { label: "Often and painful",        value: "often with painful, cystic or hormonal acne" },
    ],
  },
  {
    id: "sensitivity",
    question: "How does your skin react to new products?",
    options: [
      { label: "No reaction",         value: "no reaction — adapts well to new products" },
      { label: "Slight redness, then ok", value: "slight initial redness but settles quickly" },
      { label: "Burns or stings",     value: "often burns, stings or turns red" },
      { label: "Breaks out",          value: "frequently breaks out or becomes inflamed" },
    ],
  },
  {
    id: "look",
    question: "What does your skin look like by midday?",
    options: [
      { label: "Dull or dry-patchy",         value: "dull, dry or with visible flaky patches" },
      { label: "Glowing or normal",           value: "glowing, healthy and normal" },
      { label: "Very shiny all over",         value: "very shiny or greasy all over" },
      { label: "Shiny nose/forehead only",    value: "shiny only on the T-zone; cheeks remain normal or dry" },
      { label: "Blotchy or irritated",        value: "blotchy, red or irritated" },
    ],
  },
  {
    id: "concern",
    question: "What is your primary skincare concern right now?",
    options: [
      { label: "More hydration & plumpness",      value: "lack of hydration — tight, dehydrated skin" },
      { label: "Brighter, more radiant skin",     value: "dullness — I want a visible glow" },
      { label: "Clearer skin / fewer breakouts",  value: "acne and blemish control" },
      { label: "Wrinkles & firmness",             value: "visible signs of aging — fine lines, loss of firmness" },
      { label: "Uneven tone / dark spots",        value: "dark spots, hyperpigmentation or uneven skin tone" },
      { label: "Calm down redness / sensitivity", value: "sensitivity and redness — reactive skin that needs calming" },
    ],
  },
  {
    id: "routine",
    question: "What does your current skincare routine look like?",
    options: [
      { label: "None — just water",           value: "none — just rinse with water" },
      { label: "Cleanser only",               value: "only a cleanser" },
      { label: "Cleanser and moisturiser",    value: "cleanser and moisturiser" },
      { label: "Full routine (serum + SPF)",  value: "a full routine with serums, moisturiser and SPF" },
    ],
  },
];

// ─── Result type ─────────────────────────────────────────────────
interface PredictionResult {
  skinType:    string;
  concern:     string;
  explanation: string;
  routine:     string;
}

// ─── Component ───────────────────────────────────────────────────
const SkinAnalysis = () => {
  const [stepIndex, setStepIndex]       = useState(0);
  const [answers,   setAnswers]         = useState<Record<string, string>>({});
  const [loading,   setLoading]         = useState(false);
  const [result,    setResult]          = useState<PredictionResult | null>(null);
  const [error,     setError]           = useState("");
  const navigate = useNavigate();

  const currentQ    = QUESTIONS[stepIndex];
  const totalSteps  = QUESTIONS.length;
  const progress    = Math.round(((stepIndex) / totalSteps) * 100);
  const selectedAns = answers[currentQ.id];

  const selectAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  };

  const goNext = async () => {
    if (!selectedAns) return;

    if (stepIndex < totalSteps - 1) {
      setStepIndex(i => i + 1);
    } else {
      // Final step — call backend
      await submitAnswers();
    }
  };

  const goBack = () => setStepIndex(i => Math.max(0, i - 1));

  const reset = () => {
    setStepIndex(0);
    setAnswers({});
    setResult(null);
    setError("");
  };

  const submitAnswers = async () => {
    setLoading(true);
    setError("");
    try {
      // Build readable question → answer map for the AI prompt
      const payload: Record<string, string> = {};
      QUESTIONS.forEach(q => {
        payload[q.question] = answers[q.id] ?? "";
      });

      const raw: PredictionResult = await api.post("/skin-analysis/predict", payload);
      setResult(raw);
    } catch (err) {
      setError("We couldn't reach the analysis service. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!result) return;
    try {
      await api.post("/skin-profiles", {
        skinType: result.skinType,
        concern:  result.concern,
        userId:   1,
      });
      navigate("/profile");
    } catch (err) {
      console.error(err);
      navigate("/profile");
    }
  };

  // ─── Helpers ───────────────────────────────────────────────────
  const skinTypeColor: Record<string, string> = {
    Dry:         "bg-blue-50   text-blue-700   border-blue-200",
    Oily:        "bg-green-50  text-green-700  border-green-200",
    Combination: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Normal:      "bg-rose-50   text-rose-700   border-rose-200",
    Sensitive:   "bg-purple-50 text-purple-700 border-purple-200",
  };

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">

            {/* ── Header ── */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-rose-light/60 border border-border/40 px-4 py-2 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="font-body text-[10px] uppercase tracking-[0.25em] text-primary font-medium">AI-Powered Analysis</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl italic text-foreground mb-4">
                Skin Intelligence
              </h1>
              <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
                Answer 7 questions and our AI dermatologist will predict your skin type, primary concern and build a personalised routine.
              </p>
            </div>

            {/* ── Loading ── */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in">
                <div className="w-20 h-20 bg-rose-light flex items-center justify-center border border-border/40">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <p className="font-display text-2xl italic text-foreground">Analysing your skin…</p>
                <p className="font-body text-xs text-muted-foreground">Our AI dermatologist is reviewing your answers</p>
              </div>
            )}

            {/* ── Error ── */}
            {error && !loading && (
              <div className="border border-red-200 bg-red-50 p-8 text-center animate-fade-in">
                <p className="font-body text-sm text-red-600 mb-6">{error}</p>
                <button onClick={reset} className="bg-primary text-primary-foreground px-8 py-3 font-body text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all">
                  Try Again
                </button>
              </div>
            )}

            {/* ── Result ── */}
            {result && !loading && (
              <div className="animate-fade-in space-y-6">
                {/* Top success badge */}
                <div className="flex items-center gap-3 justify-center mb-4">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <p className="font-body text-sm text-accent font-medium">Analysis Complete</p>
                </div>

                {/* Skin type + concern pills */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`border p-6 text-center ${skinTypeColor[result.skinType] ?? "bg-rose-50 border-rose-200 text-rose-700"}`}>
                    <p className="font-body text-[9px] uppercase tracking-widest mb-2 opacity-70">Skin Type</p>
                    <p className="font-display text-3xl italic">{result.skinType}</p>
                  </div>
                  <div className="bg-sage-light/60 border border-green-200 text-green-700 p-6 text-center">
                    <p className="font-body text-[9px] uppercase tracking-widest mb-2 opacity-70">Primary Concern</p>
                    <p className="font-display text-3xl italic">{result.concern}</p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-card border border-border/50 p-8">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-3">AI Diagnosis</p>
                  <p className="font-body text-sm text-foreground leading-relaxed">{result.explanation}</p>
                </div>

                {/* Routine */}
                <div className="bg-rose-light/30 border border-border/50 p-8">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Your Personalised Routine</p>
                  <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line">{result.routine}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={saveProfile}
                    className="flex-1 bg-primary text-primary-foreground py-4 font-body text-[11px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all"
                  >
                    Save to My Profile
                  </button>
                  <Link
                    to="/products"
                    className="flex-1 border border-primary/40 text-primary py-4 font-body text-[11px] uppercase tracking-[0.2em] hover:bg-rose-light transition-all text-center"
                  >
                    Shop Recommendations →
                  </Link>
                </div>

                <button onClick={reset} className="w-full flex items-center justify-center gap-2 font-body text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mt-2">
                  <RefreshCw className="h-3.5 w-3.5" /> Retake Analysis
                </button>
              </div>
            )}

            {/* ── Questionnaire ── */}
            {!loading && !result && !error && (
              <div className="animate-fade-in">
                {/* Progress bar */}
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                    Question {stepIndex + 1} of {totalSteps}
                  </p>
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">{progress}%</p>
                </div>
                <div className="h-0.5 bg-border/50 mb-10 overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>

                {/* Question */}
                <h2 className="font-display text-3xl md:text-4xl italic text-foreground mb-8">
                  {currentQ.question}
                </h2>

                {/* Options */}
                <div className="space-y-3 mb-10">
                  {currentQ.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => selectAnswer(opt.value)}
                      className={`w-full flex items-center justify-between border px-6 py-4 text-left transition-all group ${
                        selectedAns === opt.value
                          ? "bg-rose-light border-primary"
                          : "border-border/60 hover:border-primary/40 hover:bg-rose-light/20"
                      }`}
                    >
                      <span className="font-body text-sm text-foreground">{opt.label}</span>
                      {selectedAns === opt.value && (
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={goBack}
                    disabled={stepIndex === 0}
                    className="flex items-center gap-2 font-body text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!selectedAns}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-3 font-body text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-primary/90 transition-all"
                  >
                    {stepIndex === totalSteps - 1 ? "Analyse My Skin" : "Next"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SkinAnalysis;
