package com.engenharia.projeto.api_projeto_engenharia.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<String> handleNotFound(RecursoNaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro inesperado: " + ex.getMessage());
    }

    @ExceptionHandler(RequisicaoInvalidaException.class)
    public ResponseEntity<String> handleBadRequest(RequisicaoInvalidaException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro inesperado: " + ex.getMessage());
    }

    @ExceptionHandler(AcessoNaoAutorizadoException.class)
    public ResponseEntity<String> handleBadRequest(AcessoNaoAutorizadoException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erro inesperado: " + ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário inexistente ou senha inválida");
    }
}