package com.dermaSense.dermaSense.controller;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final Environment environment;
    private final String datasourceUrl;

    public HealthController(Environment environment, @Value("${spring.datasource.url:}") String datasourceUrl) {
        this.environment = environment;
        this.datasourceUrl = datasourceUrl;
    }

    @GetMapping("/db-info")
    public Map<String, Object> dbInfo() {
        Map<String, Object> result = new LinkedHashMap<>();
        String[] activeProfiles = environment.getActiveProfiles();
        String[] effectiveProfiles = activeProfiles.length == 0
                ? environment.getDefaultProfiles()
                : activeProfiles;
        boolean configured = datasourceUrl != null && !datasourceUrl.isBlank();
        boolean neonActive = Arrays.stream(effectiveProfiles).anyMatch(profile -> "neon".equalsIgnoreCase(profile));

        result.put("activeProfiles", Arrays.asList(effectiveProfiles));
        result.put("databaseTarget", detectDatabaseTarget(datasourceUrl));
        result.put("databaseHost", extractHost(datasourceUrl));
        result.put("datasourceConfigured", configured);
        result.put("database", configured ? "yes" : "no");
        result.put("startupCheck", neonActive ? "pass" : "not-applicable");
        return result;
    }

    private String detectDatabaseTarget(String jdbcUrl) {
        if (jdbcUrl == null || jdbcUrl.isBlank()) {
            return "unknown";
        }
        String lower = jdbcUrl.toLowerCase();
        if (lower.contains("h2:")) {
            return "h2";
        }
        if (lower.contains("postgresql:")) {
            return "postgresql";
        }
        return "other";
    }

    private String extractHost(String jdbcUrl) {
        if (jdbcUrl == null || jdbcUrl.isBlank()) {
            return "not-configured";
        }

        String lower = jdbcUrl.toLowerCase();
        if (lower.startsWith("jdbc:h2:")) {
            return "local-h2";
        }

        int marker = jdbcUrl.indexOf("//");
        if (marker < 0) {
            return "unknown";
        }

        String hostAndPath = jdbcUrl.substring(marker + 2);
        int slashIndex = hostAndPath.indexOf('/');
        String hostPort = slashIndex >= 0 ? hostAndPath.substring(0, slashIndex) : hostAndPath;

        int atIndex = hostPort.lastIndexOf('@');
        if (atIndex >= 0 && atIndex < hostPort.length() - 1) {
            hostPort = hostPort.substring(atIndex + 1);
        }

        return hostPort.isBlank() ? "unknown" : hostPort;
    }
}
