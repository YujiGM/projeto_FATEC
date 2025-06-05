package com.engenharia.projeto.api_projeto_engenharia.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final String chaveSecreta = "minha-chave-super-secreta-1234567890"; // 32+ caracteres

    public String extrairUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(chaveSecreta.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String gerarToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 horas
                .signWith(Keys.hmacShaKeyFor(chaveSecreta.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    public boolean validarToken(String token, UserDetails userDetails) {
        final String username = extrairUsername(token);
        return username.equals(userDetails.getUsername());
    }
}