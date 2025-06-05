package com.engenharia.projeto.api_projeto_engenharia.controllers;


import org.springframework.web.bind.annotation.*;

import com.engenharia.projeto.api_projeto_engenharia.domain.cliente.ClienteService;
import com.engenharia.projeto.api_projeto_engenharia.entities.Cliente;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    private static final Logger logger = LoggerFactory.getLogger(ClienteController.class.getName());

    @PostMapping("/criarCliente")
    public ResponseEntity<Cliente> criarCliente(@RequestBody Cliente cliente) {
        Cliente novoCliente = clienteService.criarCliente(cliente);
        logger.info(
                "Cliente criado: ID={}, CodCliente={}, TipoPessoa={}, Tipo={}, CnpjCpf={}, Nome={}, NomeFantasia={}, Loja={}, DataAbertura={}, Cep={}, Numero={}, Endereco={}, Bairro={}, CodMunicipio={}, Municipio={}, Estado={}, Pais={}, Telefone={}, Email={}, HomePage={}",
                novoCliente.getId(),
                novoCliente.getCodCliente(),
                novoCliente.getTipoPessoa(),
                novoCliente.getTipo(),
                novoCliente.getCnpjCpf(),
                novoCliente.getNome(),
                novoCliente.getNomeFantasia(),
                novoCliente.getLoja(),
                novoCliente.getDataAbertura(),
                novoCliente.getCep(),
                novoCliente.getNumero(),
                novoCliente.getEndereco(),
                novoCliente.getBairro(),
                novoCliente.getCodMunicipio(),
                novoCliente.getMunicipio(),
                novoCliente.getEstado(),
                novoCliente.getPais(),
                novoCliente.getTelefone(),
                novoCliente.getEmail(),
                novoCliente.getHomePage());
        return new ResponseEntity<>(novoCliente, HttpStatus.CREATED);
    }

    @GetMapping("/listarClientes")
    public ResponseEntity<List<Cliente>> listarClientes() {
        return new ResponseEntity<>(clienteService.listarClientes(), HttpStatus.OK);
    }

    @PutMapping("/atualizarCliente/{id}")
    public Cliente atualizarCliente(@PathVariable Integer id, @RequestBody Cliente clienteAtualizado) {
        return clienteService.atualizarCliente(id, clienteAtualizado);
    }

    @DeleteMapping("/deletarCliente/{id}")
    public void deletarCliente(@PathVariable Integer id) {
        clienteService.deletarCliente(id);
    }

    @GetMapping("/buscarCliente/{id}")
    public ResponseEntity<Cliente> buscarClientePorId(@PathVariable Integer id) {
        Cliente cliente = clienteService.buscarClientePorId(id);
        return ResponseEntity.ok(cliente);
    }

    @GetMapping("/pesquisar")
    public ResponseEntity<List<Cliente>> pesquisarCliente(@RequestParam String termo) {
        List<Cliente> resultado = clienteService.pesquisarCliente(termo);
        return ResponseEntity.ok(resultado);
    }
}
