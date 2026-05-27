package com.fptmarket.config;

import com.fptmarket.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Explicit Public Authentication Endpoints
                        .requestMatchers("/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/refresh-token",
                                         "/api/auth/login", "/api/auth/register", "/api/auth/refresh-token",
                                         "/api/health", "/api/v1/payments/vnpay/callback", "/api/payments/vnpay/callback",
                                         "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // 2. Public Read-Only Browsing Subsets (Ensure wildcards capture nested layouts)
                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**", "/api/v1/categories/**",
                                                         "/api/products/**", "/api/categories/**").permitAll()

                        // 3. Systemic Administrative Isolations
                        .requestMatchers("/api/v1/admin/**", "/api/admin/**").hasRole("ADMIN")

                        // 4. Secure Profile Operations (Explicitly accessible by both USER and ADMIN)
                        .requestMatchers("/api/v1/users/me/**", "/api/v1/users/me",
                                         "/api/users/me/**", "/api/users/me").hasAnyRole("USER", "ADMIN")

                        // 5. Global Standard Consumer Paths Catch-All
                        .requestMatchers("/api/v1/cart/**", "/api/v1/orders/**", "/api/v1/seller/**",
                                         "/api/cart/**", "/api/orders/**", "/api/seller/**").hasAnyRole("USER", "ADMIN")

                        // 6. Final Catch-All Lock
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
