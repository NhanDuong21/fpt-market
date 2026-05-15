package com.fptmarket.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI fptMarketOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("FPT-Market API")
                        .description("REST API documentation for FPT-Market")
                        .version("v0.0.1"));
    }
}
