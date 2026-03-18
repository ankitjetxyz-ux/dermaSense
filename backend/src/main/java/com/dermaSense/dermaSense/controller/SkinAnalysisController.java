package com.dermaSense.dermaSense.controller;

import com.dermaSense.dermaSense.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Exposes AI skin-analysis functionality powered by Gemini.
 *
 * POST /api/skin-analysis/predict
 * Body: { "q1": "answer1", "q2": "answer2", ... }
 * Returns: { "skinType": "...", "concern": "...", "explanation": "...", "routine": "..." }
 */
@RestController
@RequestMapping("/api/skin-analysis")
public class SkinAnalysisController {

    private final GeminiService geminiService;

    public SkinAnalysisController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/predict")
    public ResponseEntity<String> predict(@RequestBody Map<String, String> answers) {
        if (answers == null || answers.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\":\"No answers provided\"}");
        }
        String result = geminiService.predictSkinProfile(answers);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(result);
    }
}
