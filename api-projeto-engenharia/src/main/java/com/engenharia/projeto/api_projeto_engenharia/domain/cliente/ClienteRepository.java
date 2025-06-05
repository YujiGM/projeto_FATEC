package com.engenharia.projeto.api_projeto_engenharia.domain.cliente;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.engenharia.projeto.api_projeto_engenharia.entities.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
        @Query("SELECT DISTINCT c FROM Cliente c WHERE " +
                        "REPLACE(REPLACE(REPLACE(LOWER(c.cnpjCpf), '.', ''), '-', ''), '/', '') LIKE REPLACE(REPLACE(REPLACE(LOWER(CONCAT(:termo, '%')), '.', ''), '-', ''), '/', '') OR "
                        + 
                        "LOWER(c.codCliente) LIKE LOWER(CONCAT(:termo, '%')) OR " +
                        "LOWER(c.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
                        "LOWER(c.municipio) LIKE LOWER(CONCAT(:termo, '%'))")
        List<Cliente> pesquisarPorMultiplosCampos(@Param("termo") String termo);

}
