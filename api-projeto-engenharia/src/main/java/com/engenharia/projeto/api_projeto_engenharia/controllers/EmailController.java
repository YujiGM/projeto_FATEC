package com.engenharia.projeto.api_projeto_engenharia.controllers;

import com.engenharia.projeto.api_projeto_engenharia.infrastructure.javaMailSender.EmailDto;
import com.engenharia.projeto.api_projeto_engenharia.infrastructure.javaMailSender.EmailService;
import jakarta.mail.MessagingException;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/enviar")
    public ResponseEntity<String> enviarEmail(@RequestBody EmailDto emailDto) throws MessagingException, IOException {

        emailService.enviarEmail(emailDto);
        return ResponseEntity.ok("E-mail enviado com sucesso!");

    }

}
