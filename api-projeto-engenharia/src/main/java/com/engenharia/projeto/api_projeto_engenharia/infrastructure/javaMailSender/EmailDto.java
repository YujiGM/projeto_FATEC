package com.engenharia.projeto.api_projeto_engenharia.infrastructure.javaMailSender;

import com.engenharia.projeto.api_projeto_engenharia.entities.Cliente;

public class EmailDto {
    private Cliente cliente;
    private String emailDestino;

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getEmailDestino() {
        return emailDestino;
    }

    public void setEmailDestino(String emailDestino) {
        this.emailDestino = emailDestino;
    }
}
