package com.engenharia.projeto.api_projeto_engenharia.util;

import com.engenharia.projeto.api_projeto_engenharia.entities.Cliente;

import com.engenharia.projeto.api_projeto_engenharia.exception.RequisicaoInvalidaException;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.regex.Pattern;

@Component
public class ValidadorUtil {
    private static final Pattern CEP_PATTERN = Pattern.compile("^\\d{8}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

    public void validarCliente(Cliente cliente) {
        validarCamposObrigatorios(cliente);
        validarTipoPessoa(cliente);
        validarFormatoCampos(cliente);
    }

    public boolean validarEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    private void validarCamposObrigatorios(Cliente cliente) {
        if (cliente.getCodCliente() == null || cliente.getCodCliente().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Código do cliente é obrigatório");
        }

        if (cliente.getTipoPessoa() == null || cliente.getTipoPessoa().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Tipo de pessoa é obrigatório");
        }

        if (cliente.getTipo() == null || cliente.getTipo().trim().isEmpty()) {
            cliente.setTipo("F");
        }

        if (cliente.getCnpjCpf() == null || cliente.getCnpjCpf().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("CNPJ/CPF é obrigatório");
        }

        if (cliente.getNome() == null || cliente.getNome().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Nome/Razão Social é obrigatório");
        }

        if (cliente.getNomeFantasia() == null || cliente.getNomeFantasia().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Nome Fantasia é obrigatório");
        }

        if (cliente.getLoja() == null || cliente.getLoja().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Loja é obrigatória");
        }

        if (cliente.getDataAbertura() == null) {
            throw new RequisicaoInvalidaException("Data de abertura é obrigatória");
        }

        if (cliente.getCep() == null || cliente.getCep().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("CEP é obrigatório");
        }

        if (cliente.getEndereco() == null || cliente.getEndereco().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Endereço é obrigatório");
        }

        if (cliente.getMunicipio() == null || cliente.getMunicipio().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Município é obrigatório");
        }

        if (cliente.getEstado() == null || cliente.getEstado().trim().isEmpty()) {
            throw new RequisicaoInvalidaException("Estado é obrigatório");
        }
    }

    private void validarTipoPessoa(Cliente cliente) {
        if (!"F".equals(cliente.getTipoPessoa()) && !"J".equals(cliente.getTipoPessoa())) {
            throw new RequisicaoInvalidaException("Tipo de pessoa deve ser 'F' (Física) ou 'J' (Jurídica)");
        }

        if ("J".equals(cliente.getTipoPessoa()) &&
                (cliente.getTipo() == null || cliente.getTipo().trim().isEmpty())) {
            throw new RequisicaoInvalidaException("Tipo de cliente é obrigatório para Pessoa Jurídica");
        }
    }

    private void validarFormatoCampos(Cliente cliente) {
        if (!validarCEP(cliente.getCep())) {
            throw new RequisicaoInvalidaException("CEP deve conter 8 dígitos");
        }

        if (cliente.getEmail() != null && !cliente.getEmail().isEmpty() &&
                !validarEmail(cliente.getEmail())) { // Usando a nova função aqui
            throw new RequisicaoInvalidaException("Email inválido");
        }


        if ("F".equals(cliente.getTipoPessoa())) {
            if (!validarCPF(cliente.getCnpjCpf())) {
                throw new RequisicaoInvalidaException("CPF inválido");
            }
        } else {
            if (!validarCNPJ(cliente.getCnpjCpf())) {
                throw new RequisicaoInvalidaException("CNPJ inválido");
            }
        }
    }

    public boolean validarCPF(String cpf) {
        if (cpf == null)
            return false;

        cpf = cpf.replaceAll("\\D", "");

        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}")) {
            return false;
        }

        try {
        
            int soma = 0;
            for (int i = 0; i < 9; i++) {
                soma += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
            }
            int primeiroDigito = 11 - (soma % 11);
            if (primeiroDigito >= 10)
                primeiroDigito = 0;

            if (primeiroDigito != Character.getNumericValue(cpf.charAt(9))) {
                return false;
            }

            
            soma = 0;
            for (int i = 0; i < 10; i++) {
                soma += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
            }
            int segundoDigito = 11 - (soma % 11);
            if (segundoDigito >= 10)
                segundoDigito = 0;

            return segundoDigito == Character.getNumericValue(cpf.charAt(10));

        } catch (Exception e) {
            return false;
        }
    }

    public boolean validarCNPJ(String cnpj) {
        if (cnpj == null)
            return false;

        cnpj = cnpj.replaceAll("\\D", "");

        if (cnpj.length() != 14 || cnpj.matches("(\\d)\\1{13}")) {
            return false;
        }

        try {
            
            int[] peso1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int soma = 0;
            for (int i = 0; i < 12; i++) {
                soma += Character.getNumericValue(cnpj.charAt(i)) * peso1[i];
            }
            int primeiroDigito = 11 - (soma % 11);
            if (primeiroDigito >= 10)
                primeiroDigito = 0;

            if (primeiroDigito != Character.getNumericValue(cnpj.charAt(12))) {
                return false;
            }

        
            int[] peso2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            soma = 0;
            for (int i = 0; i < 13; i++) {
                soma += Character.getNumericValue(cnpj.charAt(i)) * peso2[i];
            }
            int segundoDigito = 11 - (soma % 11);
            if (segundoDigito >= 10)
                segundoDigito = 0;

            return segundoDigito == Character.getNumericValue(cnpj.charAt(13));

        } catch (Exception e) {
            return false;
        }
    }

    public boolean validarCEP(String cep) {
        if (cep == null)
            return false;
        String cepLimpo = cep.replaceAll("\\D", "");
        return CEP_PATTERN.matcher(cepLimpo).matches();
    }

    public boolean validarData(String data) {
        if (data == null || data.trim().isEmpty())
            return false;

        try {
            LocalDate.parse(data, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            return true;
        } catch (DateTimeParseException e) {
            return false;
        }
    }
}