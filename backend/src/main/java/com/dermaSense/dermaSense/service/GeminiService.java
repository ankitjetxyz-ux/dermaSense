package com.dermaSense.dermaSense.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Calls the Gemini REST API to predict skin type and concern
 * based on questionnaire answers supplied by the user.
 */
@Service
public class GeminiService {

    private final WebClient webClient;
    private final String apiKey;

    public GeminiService(
            WebClient.Builder builder,
            @Value("${gemini.api.url}") String apiUrl,
            @Value("${gemini.api.key}") String apiKey) {
        this.webClient = builder.baseUrl(apiUrl).build();
        this.apiKey = apiKey;
    }

    /**
     * Sends a structured prompt to Gemini and returns the predicted
     * skin profile as a plain-text JSON string.
     *
     * @param answers  Map of question → answer from the questionnaire
     * @return         JSON string like {"skinType":"Oily","concern":"Acne","routine":"..."}
     */
    public String predictSkinProfile(Map<String, String> answers) {

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
                "maxOutputTokens", 512,
                "responseMimeType", "application/json"
            )
        );

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.post()
                    .uri("?key=" + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(20))
                    .block();

            if (response == null) return fallback();

            // Navigate: candidates[0].content.parts[0].text
            @SuppressWarnings("unchecked")
            var candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) return fallback();

            @SuppressWarnings("unchecked")
            var content = (Map<String, Object>) candidates.get(0).get("content");
            @SuppressWarnings("unchecked")
            var parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");

        } catch (Exception e) {
            return fallback();
        }
    }

    // ── helpers ───────────────────────────────────────────────────────

    private String buildPrompt(Map<String, String> answers) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a professional dermatologist and skincare expert. ");
        sb.append("Based on the following answers to a skin questionnaire, predict the user's skin type and primary concern. ");
        sb.append("Respond ONLY with a valid JSON object in this exact format:\n");
        sb.append("{\"skinType\": \"<Dry|Oily|Combination|Normal|Sensitive>\", ");
        sb.append("\"concern\": \"<Hydration|Glow|Acne|Anti-Aging|Hyperpigmentation|Sensitivity>\", ");
        sb.append("\"explanation\": \"<2-3 sentence explanation>\", ");
        sb.append("\"routine\": \"<brief morning and evening routine recommendation>\"}\n\n");
        sb.append("Questionnaire answers:\n");
        answers.forEach((q, a) -> sb.append("- ").append(q).append(": ").append(a).append("\n"));
        return sb.toString();
    }

    private String fallback() {
        return "{\"skinType\":\"Normal\",\"concern\":\"Hydration\"," +
               "\"explanation\":\"We could not reach the AI service. This is a default recommendation.\"," +
               "\"routine\":\"Use a gentle cleanser, apply a hyaluronic acid serum, and finish with SPF 30+ in the morning. At night, use a ceramide moisturiser.\"}";
    }
}
