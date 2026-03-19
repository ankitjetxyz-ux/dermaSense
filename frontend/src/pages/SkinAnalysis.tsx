import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Sparkles, CheckCircle, Loader2, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { getCurrentUser, saveLocalProfile } from "@/lib/session";
import { generateGeminiAnalysis, GeminiAnalysis } from "@/lib/gemini";

// ─── Questionnaire definition ────────────────────────────────────
const QUESTIONS = [
  {
    id: "feelAfterWash",
    question: "1) How does your skin feel 30 minutes after washing it with a gentle cleanser?",
    options: [
      { label: "A) Tight and uncomfortable", value: "Tight and uncomfortable" },
      { label: "B) Soft and balanced", value: "Soft and balanced" },
      { label: "C) Shiny in the T-zone but tight on the cheeks", value: "Shiny in the T-zone but tight on the cheeks" },
      { label: "D) Slick and greasy all over", value: "Slick and greasy all over" },
    ],
  },
  {
    id: "poresVisibility",
    question: "2) Look in the mirror under bright light. How visible are your pores?",
    options: [
      { label: "A) Almost invisible", value: "Almost invisible" },
      { label: "B) Visible but not large", value: "Visible but not large" },
      { label: "C) Enlarged only on the nose and forehead", value: "Enlarged only on the nose and forehead" },
      { label: "D) Large and visible across the entire face", value: "Large and visible across the entire face" },
    ],
  },
  {
    id: "blotFrequency",
    question: "3) How often do you feel the need to blot your face or apply powder during the day?",
    options: [
      { label: "A) Never; my skin rarely looks shiny", value: "Never; my skin rarely looks shiny" },
      { label: "B) Maybe once in the late afternoon", value: "Maybe once in the late afternoon" },
      { label: "C) Usually just on my nose or forehead by midday", value: "Usually just on my nose or forehead by midday" },
      { label: "D) Multiple times a day; my face feels greasy within two hours", value: "Multiple times a day; my face feels greasy within two hours" },
    ],
  },
  {
    id: "textureFeel",
    question: "4) Describe the texture of your skin when you run your fingers over it.",
    options: [
      { label: "A) Rough, flaky, or papery", value: "Rough, flaky, or papery" },
      { label: "B) Smooth and firm", value: "Smooth and firm" },
      { label: "C) Smooth in some areas, but bumpy or oily in others", value: "Smooth in some areas, but bumpy or oily in others" },
      { label: "D) Thick and oily, sometimes with a 'clogged' feel", value: "Thick and oily, sometimes with a 'clogged' feel" },
    ],
  },
  {
    id: "moisturizerReaction",
    question: "5) How does your skin react to moisturizer?",
    options: [
      { label: "A) It drinks it up instantly and often stays thirsty", value: "It drinks it up instantly and often stays thirsty" },
      { label: "B) It feels comfortable and hydrated", value: "It feels comfortable and hydrated" },
      { label: "C) It feels good on my cheeks but can feel too heavy on my T-zone", value: "It feels good on my cheeks but can feel too heavy on my T-zone" },
      { label: "D) It often feels weighed down or even more greasy", value: "It often feels weighed down or even more greasy" },
    ],
  },
  {
    id: "productSensitivity",
    question: "6) How frequently does your skin turn red or feel itchy after using a new product?",
    options: [
      { label: "A) Almost every time", value: "Almost every time" },
      { label: "B) Rarely or only with very harsh products", value: "Rarely or only with very harsh products" },
      { label: "C) Only in specific spots", value: "Only in specific spots" },
      { label: "D) Never; my skin is quite resilient", value: "Never; my skin is quite resilient" },
    ],
  },
  {
    id: "environmentReaction",
    question: "7) Does your skin react (stinging or flushing) to environmental factors like wind, sun, or spicy food?",
    options: [
      { label: "A) Yes, very easily", value: "Yes, very easily" },
      { label: "B) Occasionally", value: "Occasionally" },
      { label: "C) Usually only to extreme heat", value: "Usually only to extreme heat" },
      { label: "D) Not really", value: "Not really" },
    ],
  },
  {
    id: "breakoutFrequency",
    question: "8) How often do you experience breakouts (pimples or whiteheads)?",
    options: [
      { label: "A) Rarely", value: "Rarely" },
      { label: "B) Occasionally (e.g., once a month)", value: "Occasionally (e.g., once a month)" },
      { label: "C) Frequently, mostly in the T-zone", value: "Frequently, mostly in the T-zone" },
      { label: "D) Constantly, all over the face", value: "Constantly, all over the face" },
    ],
  },
  {
    id: "darkSpots",
    question: "9) Do you notice dark spots or 'shadows' left behind after a blemish heals?",
    options: [
      { label: "A) No", value: "No" },
      { label: "B) Sometimes, but they fade quickly", value: "Sometimes, but they fade quickly" },
      { label: "C) Yes, they take months to disappear", value: "Yes, they take months to disappear" },
      { label: "D) They are a primary concern", value: "They are a primary concern" },
    ],
  },
  {
    id: "fineLines",
    question: "10) Do you see fine lines even when your face is at rest?",
    options: [
      { label: "A) Yes, especially around the eyes and mouth", value: "Yes, especially around the eyes and mouth" },
      { label: "B) Only when I smile or squint", value: "Only when I smile or squint" },
      { label: "C) Not yet", value: "Not yet" },
      { label: "D) Not a current concern", value: "Not a current concern" },
    ],
  },
  {
    id: "pinchTest",
    question: "11) When you pinch a small area of your cheek, does the skin...",
    options: [
      { label: "A) Form tiny crinkle lines (sign of dehydration)", value: "Form tiny crinkle lines" },
      { label: "B) Bounce back immediately", value: "Bounce back immediately" },
      { label: "C) Feel squishy or oily", value: "Feel squishy or oily" },
      { label: "D) Feels normal", value: "Feels normal" },
    ],
  },
  {
    id: "blackheads",
    question: "12) Do you struggle with blackheads (open comedones) on your nose or chin?",
    options: [
      { label: "A) Never", value: "Never" },
      { label: "B) A few, but they are manageable", value: "A few, but they are manageable" },
      { label: "C) Yes, they are a primary concern", value: "Yes, they are a primary concern" },
      { label: "D) They appear frequently all over", value: "They appear frequently all over" },
    ],
  },
  {
    id: "climate",
    question: "13) How would you describe your current climate?",
    options: [
      { label: "A) Arid/Dry (leads to moisture loss)", value: "Arid/Dry (leads to moisture loss)" },
      { label: "B) Humid (leads to increased oil/sweat)", value: "Humid (leads to increased oil/sweat)" },
      { label: "C) Seasonal/Changing", value: "Seasonal/Changing" },
      { label: "D) Temperate and mild", value: "Temperate and mild" },
    ],
  },
  {
    id: "morningEveningFeel",
    question: "14) Does your skin feel significantly different when you wake up versus the evening?",
    options: [
      { label: "A) It feels driest in the morning", value: "It feels driest in the morning" },
      { label: "B) It stays consistent", value: "It stays consistent" },
      { label: "C) It’s fine in the morning but gets progressively oilier", value: "It’s fine in the morning but gets progressively oilier" },
      { label: "D) Feels oilier by morning", value: "Feels oilier by morning" },
    ],
  },
  {
    id: "primaryGoal",
    question: "15) What is your primary skin goal?",
    options: [
      { label: "A) Reducing redness and irritation", value: "Reducing redness and irritation" },
      { label: "B) Clearing acne and congestion", value: "Clearing acne and congestion" },
      { label: "C) Hydrating and smoothing fine lines", value: "Hydrating and smoothing fine lines" },
      { label: "D) Evening out skin tone/pigmentation", value: "Evening out skin tone/pigmentation" },
    ],
  },
];

// ─── Result type ─────────────────────────────────────────────────
type PredictionResult = GeminiAnalysis;
interface CustomQA {
  id: number;
  question: string;
  answer: string;
}

interface RoutineSections {
  morning: string[];
  evening: string[];
  extra: string[];
}

// ─── Component ───────────────────────────────────────────────────
const SkinAnalysis = () => {
  const [stepIndex, setStepIndex]       = useState(0);
  const [answers,   setAnswers]         = useState<Record<string, string[]>>({});
  const [customQAs, setCustomQAs]       = useState<CustomQA[]>([]);
  const [newQuestion, setNewQuestion]   = useState("");
  const [newAnswer, setNewAnswer]       = useState("");
  const [loading,   setLoading]         = useState(false);
  const [result,    setResult]          = useState<PredictionResult | null>(null);
  const [error,     setError]           = useState("");
  const navigate = useNavigate();

  const baseSteps    = QUESTIONS.length;
  const MAX_QUESTIONS = 15;
  const maxCustom    = Math.max(0, MAX_QUESTIONS - QUESTIONS.length);
  const hasCustomStep = maxCustom > 0;
  const totalSteps   = baseSteps + (hasCustomStep ? 1 : 0);
  const lastStepIndex = totalSteps - 1;
  const isCustomStep = hasCustomStep && stepIndex === baseSteps;
  const currentQ    = isCustomStep ? null : QUESTIONS[stepIndex];
  const progress    = Math.round(((stepIndex + 1) / totalSteps) * 100);
  const selectedAns = currentQ ? (answers[currentQ.id] ?? []) : [];
  const canAddCustom = customQAs.length < maxCustom && newQuestion.trim() && newAnswer.trim();

  const toggleAnswer = (value: string) => {
    if (!currentQ) return;
    setAnswers(prev => {
      const existing = prev[currentQ.id] ?? [];
      const next = existing[0] === value ? [] : [value];
      return { ...prev, [currentQ.id]: next };
    });
  };

  const goNext = async () => {
    if (!isCustomStep && !selectedAns.length) return;
    if (stepIndex < lastStepIndex) {
      setStepIndex(i => Math.min(i + 1, lastStepIndex));
      return;
    }
    await submitAnswers();
  };

  const goBack = () => setStepIndex(i => Math.max(0, i - 1));

  const reset = () => {
    setStepIndex(0);
    setAnswers({});
    setResult(null);
    setError("");
    setCustomQAs([]);
    setNewQuestion("");
    setNewAnswer("");
  };

  const submitAnswers = async () => {
    setLoading(true);
    setError("");
    try {
      const payload: Record<string, string[]> = {};
      QUESTIONS.forEach(q => {
        payload[q.question] = answers[q.id] ?? [];
      });

      customQAs.forEach((qa, idx) => {
        payload[`Custom Q${idx + 1}: ${qa.question}`] = [qa.answer];
      });

      const raw = await generateGeminiAnalysis(payload);
      setResult(raw);
    } catch (err: any) {
      const message = err?.message ?? "We could not generate your analysis.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!result) return;
    const user = getCurrentUser();
    const userId = user?.id ?? 1;

    try {
      await api.post("/skin-profiles", {
        skinType: result.skinType,
        concern:  result.concern,
        userId,
      });
      navigate("/profile");
    } catch (err) {
      saveLocalProfile({ skinType: result.skinType, concern: result.concern, userId });
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

  const splitRoutine = (routine: string): RoutineSections => {
    const sections: RoutineSections = { morning: [], evening: [], extra: [] };
    const lines = routine
      .split(/\n+|;\s*/)
      .map((line) => line.trim())
      .filter(Boolean);

    lines.forEach((line) => {
      const lower = line.toLowerCase();
      if (lower.startsWith("am:")) {
        sections.morning.push(line.replace(/^am:\s*/i, ""));
      } else if (lower.startsWith("pm:")) {
        sections.evening.push(line.replace(/^pm:\s*/i, ""));
      } else {
        sections.extra.push(line);
      }
    });

    if (!sections.morning.length && lines.length) {
      sections.morning.push(lines[0]);
    }
    if (!sections.evening.length && lines.length > 1) {
      sections.evening.push(lines[1]);
    }
    if (!sections.extra.length && lines.length > 2) {
      sections.extra = lines.slice(2);
    }

    return sections;
  };

  const routineSections = result ? splitRoutine(result.routine) : null;

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">

            {/* ── Header ── */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-rose-light/60 border border-border/40 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="font-body text-[10px] uppercase tracking-[0.25em] text-primary font-medium">Skin Assessment</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl text-foreground mb-4">
                Skin Intelligence
              </h1>
              <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
                Complete the guided form to discover your skin type, likely concern, and a routine you can actually follow daily.
              </p>
            </div>

            {/* ── Loading ── */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in">
                <div className="w-20 h-20 bg-rose-light rounded-2xl flex items-center justify-center border border-border/40">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <p className="font-display text-2xl text-foreground">Analyzing your skin...</p>
                <p className="font-body text-xs text-muted-foreground">Preparing your personalized result</p>
              </div>
            )}

            {/* ── Error ── */}
            {error && !loading && (
              <div className="border border-red-200 bg-red-50 rounded-2xl p-8 text-center animate-fade-in">
                <p className="font-body text-sm text-red-600 mb-6">{error}</p>
                <button onClick={reset} className="bg-primary rounded-xl text-primary-foreground px-8 py-3 font-body text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all">
                  Try Again
                </button>
              </div>
            )}

            {/* ── Result ── */}
            {result && !loading && (
              <div className="animate-fade-in space-y-6">
                <div className="flex items-center gap-3 justify-center border border-accent/30 bg-accent/5 rounded-2xl px-4 py-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <p className="font-body text-sm text-accent font-medium">Analysis Complete</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`border rounded-2xl p-6 md:p-7 ${skinTypeColor[result.skinType] ?? "bg-rose-50 border-rose-200 text-rose-700"}`}>
                    <p className="font-body text-[9px] uppercase tracking-widest mb-2 opacity-70">Your Skin Type</p>
                    <p className="font-display text-3xl mb-1">{result.skinType}</p>
                    <p className="font-body text-xs opacity-80">Use balancing, non-stripping products designed for this skin profile.</p>
                  </div>
                  <div className="bg-sage-light/60 border border-green-200 rounded-2xl text-green-700 p-6 md:p-7">
                    <p className="font-body text-[9px] uppercase tracking-widest mb-2 opacity-70">Likely Problem You May Face</p>
                    <p className="font-display text-3xl mb-1">{result.concern}</p>
                    <p className="font-body text-xs opacity-80">Focus on consistency before adding multiple active products.</p>
                  </div>
                </div>

                <div className="ds-card p-8">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Skin Assessment Summary</p>
                  <p className="font-body text-sm text-foreground leading-relaxed">{result.explanation}</p>
                </div>

                <div className="bg-rose-light/30 border border-border/50 rounded-2xl p-8">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Routine You Should Follow (AM/PM)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-background/70 border border-border/50 rounded-xl p-4">
                      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Morning (AM)</p>
                      <ul className="font-body text-sm text-foreground leading-relaxed space-y-2 list-disc list-inside">
                        {routineSections?.morning.map((line) => (
                          <li key={`am-${line}`}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-background/70 border border-border/50 rounded-xl p-4">
                      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Evening (PM)</p>
                      <ul className="font-body text-sm text-foreground leading-relaxed space-y-2 list-disc list-inside">
                        {routineSections?.evening.map((line) => (
                          <li key={`pm-${line}`}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {(routineSections?.extra.length ?? 0) > 0 && (
                    <div className="mt-5 bg-background/70 border border-border/50 rounded-xl p-4">
                      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Extra Care</p>
                      <ul className="font-body text-sm text-foreground leading-relaxed space-y-2 list-disc list-inside">
                        {routineSections?.extra.map((line) => (
                          <li key={`extra-${line}`}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={saveProfile}
                    className="flex-1 bg-primary rounded-xl text-primary-foreground py-4 font-body text-[11px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all"
                  >
                    Save to My Profile
                  </button>
                  <Link
                    to="/products"
                    className="flex-1 border border-primary/40 rounded-xl text-primary py-4 font-body text-[11px] uppercase tracking-[0.2em] hover:bg-rose-light transition-all text-center"
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
              <div className="animate-fade-in ds-card p-6 md:p-8">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                    {isCustomStep ? "Add follow-up details" : `Question ${stepIndex + 1} of ${totalSteps}`}
                  </p>
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">{progress}%</p>
                </div>
                <div className="h-0.5 bg-border/50 mb-10 overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>

                {!isCustomStep && currentQ && (
                  <>
                    <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
                      {currentQ.question}
                    </h2>
                    <p className="font-body text-xs text-muted-foreground mb-6">Choose one option that describes your skin best.</p>

                    <div className="space-y-3 mb-10">
                      {currentQ.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => toggleAnswer(opt.value)}
                          className={`w-full flex items-center justify-between border px-6 py-4 text-left transition-all group ${
                            selectedAns.includes(opt.value)
                              ? "bg-rose-light border-primary shadow-[0_0_0_1px_rgba(0,0,0,0.03)]"
                              : "border-border/60 hover:border-primary/40 hover:bg-rose-light/20"
                          }`}
                        >
                          <span className="font-body text-sm text-foreground pr-3">{opt.label}</span>
                          {selectedAns.includes(opt.value) && (
                            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {isCustomStep && (
                  <div className="border border-border/60 rounded-2xl bg-card p-5 mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">Add your own question</p>
                        <p className="font-body text-[11px] text-muted-foreground">Add extra context (up to {maxCustom} custom questions).</p>
                      </div>
                      <span className="font-body text-[11px] text-muted-foreground">{customQAs.length}/{maxCustom}</span>
                    </div>
                    <div className="space-y-3">
                      <input
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="e.g., How does your skin react to sunscreen?"
                        className="w-full border-b border-border bg-transparent outline-none py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary transition-colors"
                      />
                      <textarea
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Your answer"
                        className="w-full border border-border bg-transparent outline-none p-3 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary transition-colors min-h-[90px]"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={!canAddCustom}
                          onClick={() => {
                            if (!canAddCustom) return;
                            setCustomQAs(prev => ([...prev, { id: Date.now(), question: newQuestion.trim(), answer: newAnswer.trim() }]));
                            setNewQuestion("");
                            setNewAnswer("");
                          }}
                          className="border border-primary text-primary px-4 py-2 font-body text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-rose-light/40 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {customQAs.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {customQAs.map((qa) => (
                          <div key={qa.id} className="flex items-start justify-between gap-3 border border-border/60 px-3 py-2">
                            <div>
                              <p className="font-body text-sm text-foreground">{qa.question}</p>
                              <p className="font-body text-xs text-muted-foreground">{qa.answer}</p>
                            </div>
                            <button
                              type="button"
                              className="font-body text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                              onClick={() => setCustomQAs(prev => prev.filter(item => item.id !== qa.id))}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    onClick={goBack}
                    disabled={stepIndex === 0}
                    className="flex items-center gap-2 font-body text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    onClick={isCustomStep ? submitAnswers : goNext}
                    disabled={!isCustomStep && !selectedAns.length}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-3 font-body text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-primary/90 transition-all"
                  >
                    {isCustomStep ? "Analyse My Skin" : "Next"}
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
