package com.dermaSense.dermaSense.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.context.EnvironmentAware;
import org.springframework.stereotype.Component;

@Component
@Profile("neon")
public class NeonDatabaseStartupCheck implements BeanFactoryPostProcessor, EnvironmentAware {

    private Environment environment;

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        if (environment == null) {
            throw new IllegalStateException("Neon startup check failed: Spring environment was not initialized.");
        }
        String url = environment.getProperty("spring.datasource.url", "").trim();
        String username = environment.getProperty("spring.datasource.username", "").trim();
        String password = environment.getProperty("spring.datasource.password", "").trim();

        if (url.isBlank()) {
            throw new IllegalStateException("Neon startup check failed: spring.datasource.url is empty. Set NEON_DB_JDBC_URL or NEON_DB_URL.");
        }
        if (!url.startsWith("jdbc:postgresql://")) {
            throw new IllegalStateException("Neon startup check failed: datasource URL must start with jdbc:postgresql://");
        }

        String hostSection = extractHostSection(url);
        if (hostSection.contains("@")) {
            throw new IllegalStateException(
                    "Neon startup check failed: do not embed credentials in NEON_DB_URL/NEON_DB_JDBC_URL. Use NEON_DB_USER and NEON_DB_PASSWORD instead.");
        }

        if (username.isBlank() || username.startsWith("YOUR_")) {
            throw new IllegalStateException("Neon startup check failed: NEON_DB_USER is missing or still a placeholder.");
        }
        if (password.isBlank() || password.startsWith("YOUR_")) {
            throw new IllegalStateException("Neon startup check failed: NEON_DB_PASSWORD is missing or still a placeholder.");
        }

        // Fail fast with a clear message before datasource/schema initialization starts.
        try (Connection connection = DriverManager.getConnection(url, username, password);
             Statement statement = connection.createStatement()) {
            statement.execute("SELECT 1");
        } catch (SQLException ex) {
            throw new IllegalStateException(
                    "Neon startup check failed: unable to connect to PostgreSQL using provided credentials. "
                            + "Verify NEON_DB_USER / NEON_DB_PASSWORD and database host.",
                    ex);
        }
    }

    private String extractHostSection(String jdbcUrl) {
        String withoutPrefix = jdbcUrl.substring("jdbc:postgresql://".length());
        int slashIndex = withoutPrefix.indexOf('/');
        if (slashIndex < 0) {
            return withoutPrefix;
        }
        return withoutPrefix.substring(0, slashIndex);
    }
}
