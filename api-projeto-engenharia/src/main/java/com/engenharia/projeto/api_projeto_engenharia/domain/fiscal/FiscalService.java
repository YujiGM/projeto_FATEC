package com.engenharia.projeto.api_projeto_engenharia.domain.fiscal;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.engenharia.projeto.api_projeto_engenharia.entities.Fiscal;
import com.engenharia.projeto.api_projeto_engenharia.exception.RecursoNaoEncontradoException;
import com.engenharia.projeto.api_projeto_engenharia.exception.RequisicaoInvalidaException;
import com.engenharia.projeto.api_projeto_engenharia.util.ValidadorUtil;

@Service
public class FiscalService {
    @Autowired
    private FiscalRepository fiscalRepository;
    @Autowired
    private ValidadorUtil validadorUtil;

    public List<Fiscal> listarFiscais() {
        return fiscalRepository.findAll();
    }

    public Fiscal criarFiscal(Fiscal fiscal) {
        if (fiscal.getEmail() == null || fiscal.getEmail().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Email é obrigatório");
        }

        if (!validadorUtil.validarEmail(fiscal.getEmail())) {
            throw new RequisicaoInvalidaException("Email inválido");
        }
        if (fiscalRepository.count() > 0) {
            throw new RequisicaoInvalidaException("Já existe um fiscal cadastrado. Não é permitido mais de um.");
        }
        fiscal.setId(null);
        Fiscal fiscalCriado = fiscalRepository.save(fiscal);
        return fiscalCriado;
    }

    public Fiscal atualizarFiscal(Long id, Fiscal fiscalAtualizado) {
        Fiscal fiscal = fiscalRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Fiscal com ID " + id + " não encontrado"));

        if (fiscalAtualizado.getEmail() == null || fiscalAtualizado.getEmail().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Email é obrigatório");
        }

        if (!validadorUtil.validarEmail(fiscalAtualizado.getEmail())) {
            throw new RequisicaoInvalidaException("Email inválido");
        }
        fiscal.setEmail(fiscalAtualizado.getEmail());

        return fiscalRepository.save(fiscal);
    }

    public void deletarFiscal(long id) {
        if (!fiscalRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Fiscal com ID " + id + " não encontrado");
        }
        fiscalRepository.deleteById(id);
    }

    public Fiscal buscarFiscalPorId(Long id) {
        return fiscalRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Fiscal com ID " + id + " não encontrado"));
    }
}
