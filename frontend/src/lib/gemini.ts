export interface GeminiAnalysis {
  skinType: string;
  concern: string;
  explanation: string;
  routine: string;
}

export interface GeminiCheckResult {
  status: "ok" | "quota" | "error";
  message: string;
  modelsCount?: string;
}

function requireApiBase(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) {
    throw new Error("Missing VITE_API_BASE_URL in your environment.");
  }
  return base.replace(/\/$/, "");
}

function validateShape(parsed: any): GeminiAnalysis {
  if (!parsed?.skinType || !parsed?.concern || !parsed?.explanation || !parsed?.routine) {
    throw new Error("Analysis API returned an unexpected shape.");
  }
  return parsed as GeminiAnalysis;
}

export async function checkGeminiApi(): Promise<GeminiCheckResult> {
  const base = requireApiBase();
  const res = await fetch(`${base}/api/skin-analysis/check`);

  const text = await res.text();
  if (!text) {
    throw new Error("Gemini check returned an empty response.");
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error("Gemini check parse error", err, text);
    throw new Error("Could not parse Gemini check response.");
  }

  if (!res.ok) {
    const msg = parsed?.message || `Gemini check failed (${res.status}).`;
    throw new Error(msg);
  }

  return {
    status: parsed?.status ?? "ok",
    message: parsed?.message ?? "Gemini API is reachable.",
    modelsCount: parsed?.modelsCount,
  };
}

export async function generateGeminiAnalysis(answers: Record<string, string[]>): Promise<GeminiAnalysis> {
  const base = requireApiBase();
  const res = await fetch(`${base}/api/skin-analysis/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });

  if (!res.ok) {
    const details = await res.text();
    if (res.status === 429 || details.includes("quota") || details.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("Our analysis service is currently busy. Please try again in a minute.");
    }
    throw new Error("We could not generate your skin assessment right now. Please try again.");
  }

  const text = await res.text();
  if (!text) {
    throw new Error("Analysis API returned an empty response.");
  }

  try {
    const parsed = JSON.parse(text);
    return validateShape(parsed);
  } catch (err) {
    console.error("Analysis API parse error", err, text);
    throw new Error("Could not parse analysis response. Try again.");
  }
}