package com.panda_bobba.spring_bobba.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String[] RUTAS_PUBLICAS = {
        "/", "/inicio", "/productos", "/nosotros",
        "/css/**", "/js/**", "/images/**",
        "/gestion-catalogo", "/gestion-catalogo/**", "/actuator/health",
        "/login", "/panel", "/gestion", "/admin/productos", "/admin/productos/**", "/access-denied"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .requestCache(cache -> cache.disable())
            .logout(logout -> logout.disable())
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/error").permitAll()
                .requestMatchers(HttpMethod.GET, RUTAS_PUBLICAS).permitAll()
                .requestMatchers(HttpMethod.HEAD, RUTAS_PUBLICAS).permitAll()
                .anyRequest().denyAll());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
