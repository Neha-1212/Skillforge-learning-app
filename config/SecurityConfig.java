package com.example.jwt.config;

import com.example.jwt.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                // Public routes
                .requestMatchers("/api/auth/**").permitAll()

                // Admin routes
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Instructor-only modifications (create/update/delete courses & lessons)
                .requestMatchers(HttpMethod.POST, "/api/courses/**").hasRole("INSTRUCTOR")
                .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasRole("INSTRUCTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasRole("INSTRUCTOR")

                .requestMatchers(HttpMethod.POST, "/api/lessons/**").hasRole("INSTRUCTOR")
                .requestMatchers(HttpMethod.PUT, "/api/lessons/**").hasRole("INSTRUCTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/lessons/**").hasRole("INSTRUCTOR")

                // Read access: instructors & students can GET course/lesson data
                .requestMatchers(HttpMethod.GET, "/api/courses/**").hasAnyRole("INSTRUCTOR", "STUDENT")
                .requestMatchers(HttpMethod.GET, "/api/lessons/**").hasAnyRole("INSTRUCTOR", "STUDENT")
                
             // Module Routes FIX
                .requestMatchers(HttpMethod.POST, "/api/modules/**").hasRole("INSTRUCTOR")
                .requestMatchers(HttpMethod.PUT, "/api/modules/**").hasRole("INSTRUCTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/modules/**").hasRole("INSTRUCTOR")
                .requestMatchers(HttpMethod.GET, "/api/modules/**").hasAnyRole("INSTRUCTOR", "STUDENT")
                .requestMatchers("/api/upload").permitAll()   // ✅ ADD THIS
               

                // Any other request needs authentication
                .anyRequest().authenticated()
            )
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Global CORS configuration - allow local dev ports
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        // Add other frontend origins you use in dev
        config.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://localhost:3000"
        ));

        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
