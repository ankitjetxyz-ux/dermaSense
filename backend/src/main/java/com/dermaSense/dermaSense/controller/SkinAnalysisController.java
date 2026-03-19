package com.dermaSense.dermaSense.controller;

import com.dermaSense.dermaSense.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Exposes AI skin-analysis functionality powered by Gemini.
 *
 * POST /api/skin-analysis/predict
 * Body: { "q1": "answer1", "q2": "answer2", ... }
 * Returns: { "skinType": "...", "concern": "...", "explanation": "...", "routine": "..." }
 */
@RestController
public class SkinAnalysisController {

    private final GeminiService geminiService;

    public SkinAnalysisController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/api/skin-analysis/check")
    public ResponseEntity<Map<String, String>> checkGemini() {
        try {
            return ResponseEntity.ok(geminiService.checkApiAccess());
        } catch (IllegalStateException ex) {
            String safeMessage = ex.getMessage() == null
                    ? "Gemini check failed"
                    : ex.getMessage().replace("\"", "'");
            return ResponseEntity.status(502).body(Map.of(
                    "status", "error",
                    "message", safeMessage
            ));
        }
    }

    @PostMapping({"/api/skin-analysis/predict", "/analyze"})
    public ResponseEntity<String> predict(@RequestBody Map<String, java.util.List<String>> answers) {
        if (answers == null || answers.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\":\"No answers provided\"}");
        }
        try {
            String result = geminiService.predictSkinProfile(answers);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(result);
        } catch (IllegalStateException ex) {
            String safeMessage = ex.getMessage() == null
                    ? "Gemini analysis failed"
                    : ex.getMessage().replace("\"", "'");
            return ResponseEntity.status(502)
                    .header("Content-Type", "application/json")
                    .body("{\"error\":\"" + safeMessage + "\"}");
        }
    }
}
