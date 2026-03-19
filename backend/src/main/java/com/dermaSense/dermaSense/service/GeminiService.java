package com.dermaSense.dermaSense.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Calls the Gemini REST API to predict skin type and concern
 * based on questionnaire answers supplied by the user.
 */
@Service
public class GeminiService {

    private final WebClient webClient;
    private final String apiKey;
    private final String apiUrl;

    public GeminiService(
            WebClient.Builder builder,
            @Value("${gemini.api.url}") String apiUrl,
            @Value("${gemini.api.key}") String apiKey) {
        this.webClient = builder.build();
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    /**
     * Sends a structured prompt to Gemini and returns the predicted
     * skin profile as a plain-text JSON string.
     *
     * @param answers  Map of question → selected answers from the questionnaire
     * @return         JSON string like {"skinType":"Oily","concern":"Acne","routine":"..."}
     */
    public String predictSkinProfile(Map<String, List<String>> answers) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Gemini API key is missing on backend. Set VITE_GEMINI_API_KEY in backend environment.");
        }
        if (apiUrl == null || apiUrl.isBlank()) {
            throw new IllegalStateException("Gemini API URL is missing. Set gemini.api.url in backend configuration.");
        }

        String prompt = buildPrompt(answers);

        // Build the Gemini request body
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            ),
            "generationConfig", Map.of(
                "temperature",     0.4,
                "maxOutputTokens", 512
            )
        );

        List<String> candidateUrls = buildCandidateUrls(apiUrl);
        IllegalStateException lastModelError = null;

        for (String candidateUrl : candidateUrls) {
            try {
                Map<String, Object> response = callGemini(candidateUrl, requestBody);
                return parseGeminiResponse(response);
            } catch (WebClientResponseException e) {
                String detail = e.getResponseBodyAsString();
                if (e.getStatusCode().value() == 429) {
                    return buildQuotaFallbackProfile(answers);
                }
                if (isModelNotFound(e, detail)) {
                    lastModelError = new IllegalStateException(
                            "Gemini model not available at " + candidateUrl + ".",
                            e
                    );
                    continue;
                }
                throw new IllegalStateException("Gemini API error " + e.getStatusCode().value() + (detail == null || detail.isBlank() ? "" : ": " + detail), e);
            } catch (Exception e) {
                throw new IllegalStateException("Gemini analysis failed: " + e.getMessage(), e);
            }
        }

        if (lastModelError != null) {
            throw new IllegalStateException(
                    "Gemini model endpoint is unavailable for this API key/project. Update gemini.api.url to a model returned by ListModels.",
                    lastModelError
            );
        }
        throw new IllegalStateException("Gemini analysis failed: no model endpoint could be used.");
    }

    public Map<String, String> checkApiAccess() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Gemini API key is missing on backend. Set VITE_GEMINI_API_KEY in backend environment.");
        }

        List<String> listModelsUrls = List.of(
                "https://generativelanguage.googleapis.com/v1/models",
                "https://generativelanguage.googleapis.com/v1beta/models"
        );

        for (String listUrl : listModelsUrls) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> response = webClient.get()
                        .uri(listUrl + "?key=" + apiKey)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .timeout(Duration.ofSeconds(15))
                        .block();

                if (response == null) {
                    continue;
                }

                @SuppressWarnings("unchecked")
                List<Map<String, Object>> models = (List<Map<String, Object>>) response.get("models");
                int count = models == null ? 0 : models.size();
                return Map.of(
                        "status", "ok",
                        "message", "Gemini API key is valid. ListModels is reachable.",
                        "modelsCount", String.valueOf(count)
                );
            } catch (WebClientResponseException e) {
                String detail = e.getResponseBodyAsString();
                int code = e.getStatusCode().value();
                if (code == 429) {
                    return Map.of(
                            "status", "quota",
                            "message", "Gemini API is reachable, but quota is currently exceeded."
                    );
                }
                if (code == 401 || code == 403) {
                    throw new IllegalStateException("Gemini API key is invalid or not authorized.", e);
                }
                if (code == 404) {
                    continue;
                }
                throw new IllegalStateException("Gemini API error " + code + (detail == null || detail.isBlank() ? "" : ": " + detail), e);
            } catch (Exception e) {
                throw new IllegalStateException("Gemini check failed: " + e.getMessage(), e);
            }
        }

        throw new IllegalStateException("Could not reach Gemini ListModels endpoint.");
    }

    // ── helpers ───────────────────────────────────────────────────────

    private List<String> buildCandidateUrls(String configuredUrl) {
        LinkedHashSet<String> urls = new LinkedHashSet<>();
        urls.add(configuredUrl);
        urls.add("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent");
        urls.add("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent");
        urls.add("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent");
        urls.add("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent");
        return new ArrayList<>(urls);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> callGemini(String url, Map<String, Object> requestBody) {
        String uri = url.contains("?") ? (url + "&key=" + apiKey) : (url + "?key=" + apiKey);
        return webClient.post()
                .uri(uri)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(20))
                .block();
    }

    private boolean isModelNotFound(WebClientResponseException e, String detail) {
        return e.getStatusCode().value() == 404
                && detail != null
                && detail.contains("models/")
                && detail.toLowerCase().contains("not found");
    }

    private String parseGeminiResponse(Map<String, Object> response) {
        if (response == null) {
            throw new IllegalStateException("Gemini returned an empty HTTP response.");
        }

        @SuppressWarnings("unchecked")
        var candidates = (List<Map<String, Object>>) response.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            throw new IllegalStateException("Gemini returned no candidates.");
        }

        @SuppressWarnings("unchecked")
        var content = (Map<String, Object>) candidates.get(0).get("content");
        if (content == null) {
            throw new IllegalStateException("Gemini candidate content is missing.");
        }

        @SuppressWarnings("unchecked")
        var parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) {
            throw new IllegalStateException("Gemini candidate parts are missing.");
        }

        Object rawText = parts.get(0).get("text");
        if (!(rawText instanceof String text) || text.isBlank()) {
            throw new IllegalStateException("Gemini response text is empty.");
        }

        return stripCodeFences(text);
    }

    private String buildPrompt(Map<String, List<String>> answers) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a professional dermatologist and skincare expert. ");
        sb.append("Based on the following answers to a skin questionnaire, predict the user's skin type and primary concern. ");
        sb.append("Respond ONLY with a valid JSON object in this exact format:\n");
        sb.append("{\"skinType\": \"<Dry|Oily|Combination|Normal|Sensitive>\", ");
        sb.append("\"concern\": \"<Hydration|Glow|Acne|Anti-Aging|Hyperpigmentation|Sensitivity>\", ");
        sb.append("\"explanation\": \"<2-3 sentence explanation>\", ");
        sb.append("\"routine\": \"<brief morning and evening routine recommendation>\"}\n\n");
        sb.append("Questionnaire answers:\n");
        answers.forEach((q, selections) -> {
            String joined = (selections == null || selections.isEmpty())
                    ? "No answer"
                    : selections.stream().collect(Collectors.joining(", "));
            sb.append("- ").append(q).append(": ").append(joined).append("\n");
        });
        return sb.toString();
    }

    private String stripCodeFences(String text) {
        return text
                .replace("```json", "")
                .replace("```", "")
                .trim();
    }

    private String buildQuotaFallbackProfile(Map<String, List<String>> answers) {
        String combined = answers.values().stream()
                .filter(v -> v != null && !v.isEmpty())
                .flatMap(List::stream)
                .collect(Collectors.joining(" "))
                .toLowerCase(Locale.ROOT);

        boolean hasDrySignals = containsAny(combined, "tight", "flaky", "papery", "thirsty", "dry");
        boolean hasOilySignals = containsAny(combined, "greasy", "oily", "slick", "shiny", "blackheads", "congestion");
        boolean hasSensitiveSignals = containsAny(combined, "red", "itchy", "stinging", "irritation", "sensitive");

        String skinType;
        if (hasSensitiveSignals) {
            skinType = "Sensitive";
        } else if (hasDrySignals && hasOilySignals) {
            skinType = "Combination";
        } else if (hasOilySignals) {
            skinType = "Oily";
        } else if (hasDrySignals) {
            skinType = "Dry";
        } else {
            skinType = "Normal";
        }

        String concern;
        int acneScore = countMatches(combined, "acne", "pimples", "whiteheads", "blackheads", "congestion", "breakout", "clogged");
        int hyperpigmentationScore = countMatches(combined, "dark spot", "pigment", "skin tone", "hyperpigmentation", "shadows");
        int antiAgingScore = countMatches(combined, "fine line", "wrinkle", "at rest", "around the eyes and mouth");
        int sensitivityScore = countMatches(combined, "red", "itchy", "stinging", "irritation", "sensitive", "flushing");
        int hydrationScore = countMatches(combined, "tight", "flaky", "papery", "thirsty", "dry", "dehydration", "crinkle");

        int maxScore = Math.max(
                Math.max(acneScore, hyperpigmentationScore),
                Math.max(Math.max(antiAgingScore, sensitivityScore), hydrationScore)
        );

        if (maxScore == 0) {
            concern = switch (skinType) {
                case "Oily", "Combination" -> "Acne";
                case "Sensitive" -> "Sensitivity";
                case "Dry" -> "Hydration";
                default -> "Glow";
            };
        } else if (acneScore == maxScore) {
            concern = "Acne";
        } else if (hyperpigmentationScore == maxScore) {
            concern = "Hyperpigmentation";
        } else if (sensitivityScore == maxScore) {
            concern = "Sensitivity";
        } else if (hydrationScore == maxScore) {
            concern = "Hydration";
        } else {
            concern = "Anti-Aging";
        }

        String routine = routineForProfile(skinType, concern);
        String explanation = buildAssessmentSummary(skinType, concern);

        return "{" +
                "\"skinType\":\"" + escapeJson(skinType) + "\"," +
                "\"concern\":\"" + escapeJson(concern) + "\"," +
                "\"explanation\":\"" + escapeJson(explanation) + "\"," +
                "\"routine\":\"" + escapeJson(routine) + "\"" +
                "}";
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n");
    }

    private boolean containsAny(String value, String... tokens) {
        for (String token : tokens) {
            if (value.contains(token)) {
                return true;
            }
        }
        return false;
    }

    private int countMatches(String value, String... tokens) {
        int score = 0;
        for (String token : tokens) {
            if (value.contains(token)) {
                score++;
            }
        }
        return score;
    }

    private String buildAssessmentSummary(String skinType, String concern) {
        return "Your responses are most consistent with " + skinType + " skin, with " + concern +
                " as your likely priority concern. Focus on a consistent barrier-safe routine, sun protection every morning, and one targeted treatment used gradually to avoid irritation.";
    }

    private String routineForProfile(String skinType, String concern) {
        String amBase = switch (skinType) {
            case "Dry" -> "AM: Creamy gentle cleanser; hydrating serum (hyaluronic acid or glycerin); ceramide moisturizer; broad-spectrum SPF 50.";
            case "Oily" -> "AM: Gel cleanser; niacinamide serum; lightweight non-comedogenic moisturizer; broad-spectrum SPF 50.";
            case "Combination" -> "AM: Gentle gel cleanser; hydrating serum on cheeks plus niacinamide on T-zone; light moisturizer; broad-spectrum SPF 50.";
            case "Sensitive" -> "AM: Fragrance-free gentle cleanser; calming serum (centella or panthenol); barrier moisturizer; mineral SPF 50.";
            default -> "AM: Gentle cleanser; antioxidant or hydrating serum; balanced moisturizer; broad-spectrum SPF 50.";
        };

        String pmBase = switch (skinType) {
            case "Dry" -> "PM: Gentle cleanser; richer moisturizer with ceramides; seal dry areas with a light occlusive if needed.";
            case "Oily" -> "PM: Gentle cleanser; lightweight moisturizer; avoid over-cleansing to reduce rebound oiliness.";
            case "Combination" -> "PM: Gentle cleanser; medium-weight moisturizer on dry zones and lightweight lotion on oily zones.";
            case "Sensitive" -> "PM: Gentle cleanser; ceramide-rich moisturizer; keep routine minimal and fragrance-free.";
            default -> "PM: Gentle cleanser; barrier-support moisturizer.";
        };

        String targeted = switch (concern) {
            case "Acne" -> "Targeted treatment: Salicylic acid 2% on alternate nights, then add adapalene slowly if tolerated.";
            case "Hyperpigmentation" -> "Targeted treatment: Vitamin C in the morning and azelaic acid or tranexamic acid at night.";
            case "Anti-Aging" -> "Targeted treatment: Retinoid at night 2-3 times weekly, increase gradually; pair with moisturizer.";
            case "Sensitivity" -> "Targeted treatment: Prioritize barrier repair; avoid strong acids and high-strength retinoids until stable.";
            case "Hydration" -> "Targeted treatment: Layer humectant serum under moisturizer; use a hydrating mask 2-3 times weekly.";
            default -> "Targeted treatment: Keep one active ingredient at a time and monitor tolerance for 2-3 weeks.";
        };

        String weekly = "Weekly plan: Exfoliate at most 1-2 times per week (or skip if sensitive) and reassess skin response every two weeks.";
        return amBase + "\n" + pmBase + "\n" + targeted + "\n" + weekly;
    }
}
