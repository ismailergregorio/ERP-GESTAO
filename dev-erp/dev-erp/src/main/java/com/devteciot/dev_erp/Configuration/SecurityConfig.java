package com.devteciot.dev_erp.Configuration;

import com.devteciot.dev_erp.Models.UsuarioAcesso;
import com.devteciot.dev_erp.Repository.UsuarioAcessoRepository;
import com.devteciot.dev_erp.Service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Configuration @EnableMethodSecurity
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login", "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html", "/error").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/alterar-senha").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/auth/me/nome").authenticated()
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/**").hasAnyRole("ADMIN", "ESTOQUISTA")
                .requestMatchers(HttpMethod.PUT, "/api/**").hasAnyRole("ADMIN", "ESTOQUISTA")
                .requestMatchers(HttpMethod.PATCH, "/api/**").hasAnyRole("ADMIN", "ESTOQUISTA")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasAnyRole("ADMIN", "ESTOQUISTA")
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    CommandLineRunner criarAdministradorInicial(UsuarioAcessoRepository repository, PasswordEncoder encoder,
            @Value("${erp.admin.nome:Administrador do Sistema}") String nome,
            @Value("${erp.admin.usuario:admin}") String username,
            @Value("${erp.admin.senha:Admin@123456789}") String password) {
        return args -> {
            if (!repository.existsByNomeUsuarioIgnoreCase(username)) {
                UsuarioAcesso admin = new UsuarioAcesso();
                admin.setNome(nome); admin.setNomeUsuario(username.toLowerCase(java.util.Locale.ROOT));
                admin.setSenhaHash(encoder.encode(password));
                admin.setPerfil(com.devteciot.dev_erp.Models.PerfilAcesso.ADMIN);
                admin.setAtivo(true); admin.setTrocarSenha(true);
                repository.save(admin);
            }
        };
    }

    @Bean JwtAuthenticationFilter jwtAuthenticationFilter(JwtService jwtService, UsuarioAcessoRepository repository) {
        return new JwtAuthenticationFilter(jwtService, repository);
    }

    @RequiredArgsConstructor
    static class JwtAuthenticationFilter extends OncePerRequestFilter {
        private final JwtService jwtService;
        private final UsuarioAcessoRepository repository;

        @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                String username = jwtService.validarEObterUsuario(header.substring(7));
                if (username != null) {
                    UsuarioAcesso user = repository.findByNomeUsuarioIgnoreCase(username).filter(u -> Boolean.TRUE.equals(u.getAtivo())).orElse(null);
                    if (user != null) {
                        if (Boolean.TRUE.equals(user.getTrocarSenha()) && !request.getRequestURI().equals("/api/auth/alterar-senha") && !request.getRequestURI().equals("/api/auth/me")) {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"mensagem\":\"Altere sua senha temporária antes de continuar.\"}");
                            return;
                        }
                        var auth = new UsernamePasswordAuthenticationToken(user.getNomeUsuario(), null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getPerfil().name())));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            }
            chain.doFilter(request, response);
        }
    }
}
