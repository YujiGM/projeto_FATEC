package com.engenharia.projeto.api_projeto_engenharia.domain.usuario;

import com.engenharia.projeto.api_projeto_engenharia.entities.Usuario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByEmail(String email);

    boolean existsByNome(String nome);

    Usuario findByNome(String nome);

    Usuario findByEmail(String email);

    @Query("SELECT DISTINCT u FROM Usuario u WHERE " +
       "LOWER(u.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
       "LOWER(u.email) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
       "CAST(u.id AS string) LIKE %:termo%")
    List<Usuario> pesquisarPorNomeOuEmail(@Param("termo") String termo);

}
