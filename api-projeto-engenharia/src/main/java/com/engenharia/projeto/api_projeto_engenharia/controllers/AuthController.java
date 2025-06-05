package com.engenharia.projeto.api_projeto_engenharia.controllers;

import com.engenharia.projeto.api_projeto_engenharia.entities.Usuario;
import com.engenharia.projeto.api_projeto_engenharia.exception.RequisicaoInvalidaException;
import com.engenharia.projeto.api_projeto_engenharia.domain.usuario.UsuarioRepository;
import com.engenharia.projeto.api_projeto_engenharia.security.JwtUtil;
import com.engenharia.projeto.api_projeto_engenharia.security.LoginDto;
import com.engenharia.projeto.api_projeto_engenharia.security.UsuarioDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioDetailsService usuarioDetailsService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> autenticar(@RequestBody LoginDto authRequest) {
        String username = authRequest.getUsername();
        String password = authRequest.getPassword();

        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Por favor, preencha todos os campos.");
        }
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

        UserDetails userDetails = usuarioDetailsService.loadUserByUsername(authRequest.getUsername());
        String token = jwtUtil.gerarToken(userDetails.getUsername());
        Usuario usuario = usuarioRepository.findByNome(userDetails.getUsername());
        String email = usuario.getEmail();
        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", email));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUsuarioAtual(@AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok("Usuário logado: " + userDetails.getUsername());
    }
}
