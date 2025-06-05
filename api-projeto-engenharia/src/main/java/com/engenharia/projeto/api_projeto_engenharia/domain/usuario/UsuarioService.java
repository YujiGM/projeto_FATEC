package com.engenharia.projeto.api_projeto_engenharia.domain.usuario;

import com.engenharia.projeto.api_projeto_engenharia.entities.Usuario;
import com.engenharia.projeto.api_projeto_engenharia.exception.RecursoNaoEncontradoException;
import com.engenharia.projeto.api_projeto_engenharia.exception.RequisicaoInvalidaException;
import com.engenharia.projeto.api_projeto_engenharia.util.ValidadorUtil;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ValidadorUtil validadorUtil;

    @PostConstruct
    public void criarUsuarioPadrao() {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario("admin", "admin@email.com", passwordEncoder.encode("123456"));
            usuarioRepository.save(admin);
            System.out.println("Usuário admin criado: nome=admin, senha=123456");
        }
    }

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario salvar(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getNome().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("O nome do usuário é obrigatório.");
        }

        if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("O email do usuário é obrigatório.");
        }

        if (usuario.getSenha() == null || usuario.getSenha().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("A senha do usuário é obrigatória.");
        }

        if (usuarioRepository.existsByNome(usuario.getNome())) {
            throw new RequisicaoInvalidaException("Usuario já existe.");
        }

        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RequisicaoInvalidaException("Email já está em uso.");
        }
        if (!validadorUtil.validarEmail(usuario.getEmail())) {
            throw new RequisicaoInvalidaException("Email inválido");
        }
        usuario.setId(null);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> pesquisarUsuario(String termo) {
        List<Usuario> usuarios = usuarioRepository.pesquisarPorNomeOuEmail(termo);
        if (usuarios.isEmpty()) {
            throw new RecursoNaoEncontradoException("Usuário '" + termo + "' não encontrado");
        }
        return usuarios;
    }

    public Usuario buscarPorId(Long id) {

        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário com ID " + id + " não encontrado"));

    }

    public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));

        if (usuarioAtualizado.getNome() != null && !usuarioAtualizado.getNome().isEmpty()) {
            usuarioExistente.setNome(usuarioAtualizado.getNome());
        }

        if (usuarioAtualizado.getEmail() != null && !usuarioAtualizado.getEmail().isEmpty()) {
            usuarioExistente.setEmail(usuarioAtualizado.getEmail());
        }

        if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isEmpty()) {
            usuarioExistente.setSenha(passwordEncoder.encode(usuarioAtualizado.getSenha()));
        }
        if (!validadorUtil.validarEmail(usuarioAtualizado.getEmail())) {
            throw new RequisicaoInvalidaException("Email inválido");
        }
        return usuarioRepository.save(usuarioExistente);
    }

    public void deletar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Usuario com ID " + id + " não encontrado");
        }
        usuarioRepository.deleteById(id);
    }
}
