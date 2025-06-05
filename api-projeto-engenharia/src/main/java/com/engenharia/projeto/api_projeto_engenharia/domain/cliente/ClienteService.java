package com.engenharia.projeto.api_projeto_engenharia.domain.cliente;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.engenharia.projeto.api_projeto_engenharia.entities.Cliente;
import com.engenharia.projeto.api_projeto_engenharia.exception.RecursoNaoEncontradoException;
import com.engenharia.projeto.api_projeto_engenharia.util.ValidadorUtil;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ValidadorUtil validadorUtil;

    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    public List<Cliente> pesquisarCliente(String termo) {
        List<Cliente> cliente = clienteRepository.pesquisarPorMultiplosCampos(termo);
        if (cliente.isEmpty()) {
            throw new RecursoNaoEncontradoException("Cliente: '" + termo + "' não encontrado.");
        }
        return cliente;
    }

    public Cliente criarCliente(Cliente cliente) {
        validadorUtil.validarCliente(cliente);

        cliente.setId(null);
        return clienteRepository.save(cliente);
    }

    public Cliente atualizarCliente(Integer id, Cliente clienteAtualizado) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente com ID " + id + " não encontrado"));

        validadorUtil.validarCliente(clienteAtualizado);

        cliente.setCodCliente(clienteAtualizado.getCodCliente());
        cliente.setTipoPessoa(clienteAtualizado.getTipoPessoa());
        cliente.setTipo(clienteAtualizado.getTipo());
        cliente.setCnpjCpf(clienteAtualizado.getCnpjCpf());
        cliente.setNome(clienteAtualizado.getNome());
        cliente.setNomeFantasia(clienteAtualizado.getNomeFantasia());
        cliente.setLoja(clienteAtualizado.getLoja());
        cliente.setDataAbertura(clienteAtualizado.getDataAbertura());
        cliente.setCep(clienteAtualizado.getCep());
        cliente.setNumero(clienteAtualizado.getNumero());
        cliente.setEndereco(clienteAtualizado.getEndereco());
        cliente.setBairro(clienteAtualizado.getBairro());
        cliente.setCodMunicipio(clienteAtualizado.getCodMunicipio());
        cliente.setMunicipio(clienteAtualizado.getMunicipio());
        cliente.setEstado(clienteAtualizado.getEstado());
        cliente.setPais(clienteAtualizado.getPais());
        cliente.setTelefone(clienteAtualizado.getTelefone());
        cliente.setEmail(clienteAtualizado.getEmail());
        cliente.setHomePage(clienteAtualizado.getHomePage());

        return clienteRepository.save(cliente);

    }

    public void deletarCliente(Integer id) {
        if (!clienteRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Cliente com ID " + id + " não encontrado");
        }
        clienteRepository.deleteById(id);
    }

    public Cliente buscarClientePorId(Integer id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente com ID " + id + " não encontrado"));
    }

}
