package com.engenharia.projeto.api_projeto_engenharia.security;

import com.engenharia.projeto.api_projeto_engenharia.domain.usuario.UsuarioRepository;
import com.engenharia.projeto.api_projeto_engenharia.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByNome(username);

        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado.");
        }

        return new User(usuario.getNome(), usuario.getSenha(), List.of());
    }
}
