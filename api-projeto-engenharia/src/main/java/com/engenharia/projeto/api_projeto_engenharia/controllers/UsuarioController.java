package com.engenharia.projeto.api_projeto_engenharia.controllers;

import com.engenharia.projeto.api_projeto_engenharia.domain.usuario.UsuarioService;
import com.engenharia.projeto.api_projeto_engenharia.entities.Usuario;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/criarUsuario")
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.salvar(usuario);
    }

    @GetMapping("/listarUsuario")
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/buscarUsuario/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        Usuario user = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/atualizarUsuario/{id}")
    public Usuario atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        return usuarioService.atualizar(id, usuario);
    }

    @DeleteMapping("/deletarUsuario/{id}")
    public void deletarUsuario(@PathVariable Long id) {
        usuarioService.deletar(id);
    }

    @GetMapping("/pesquisar")
    public ResponseEntity<List<Usuario>> pesquisarUsuario(@RequestParam String termo) {
        List<Usuario> resultado = usuarioService.pesquisarUsuario(termo);
        return ResponseEntity.ok(resultado);
    };
}