package com.engenharia.projeto.api_projeto_engenharia.exception;

public class AcessoNaoAutorizadoException extends RuntimeException {
    public AcessoNaoAutorizadoException(String mensagem) {
        super(mensagem);
    }
}
