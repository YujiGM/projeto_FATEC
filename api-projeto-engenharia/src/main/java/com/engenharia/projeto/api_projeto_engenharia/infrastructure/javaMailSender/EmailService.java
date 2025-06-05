package com.engenharia.projeto.api_projeto_engenharia.infrastructure.javaMailSender;

import org.slf4j.Logger; 
import org.slf4j.LoggerFactory; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async; 
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Lazy;

import com.engenharia.projeto.api_projeto_engenharia.entities.Cliente;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

   
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final EmailService self;

    public EmailService(@Lazy EmailService self) { 
        this.self = self;
    }

    public void enviarEmail(EmailDto emailDto) throws MessagingException, IOException {
        Cliente c = emailDto.getCliente();

        ClassPathResource resource = new ClassPathResource("templates/email-cadastro.html");
        String html = Files.readString(Path.of(resource.getURI()));

        html = html.replace("{{tipo}}", c.getTipo() != null ? c.getTipo() : "")
                .replace("{{nome}}", c.getNome() != null ? c.getNome() : "")
                .replace("{{nomeFantasia}}", c.getNomeFantasia() != null ? c.getNomeFantasia() : "")
                .replace("{{razao_social}}", c.getNome() != null ? c.getNome() : "") 
                .replace("{{cnpjCpf}}", c.getCnpjCpf() != null ? c.getCnpjCpf() : "")
                .replace("{{codCliente}}", c.getCodCliente() != null ? c.getCodCliente() : "")
                .replace("{{loja}}", c.getLoja() != null ? c.getLoja() : "")
                .replace("{{endereco}}", c.getEndereco() != null ? c.getEndereco() : "")
                .replace("{{numero}}", c.getNumero() != null ? c.getNumero() : "")
                .replace("{{bairro}}", c.getBairro() != null ? c.getBairro() : "")
                .replace("{{municipio}}", c.getMunicipio() != null ? c.getMunicipio() : "")
                .replace("{{codMunicipio}}", c.getCodMunicipio() != null ? c.getCodMunicipio() : "")
                .replace("{{estado}}", c.getEstado() != null ? c.getEstado() : "")
                .replace("{{pais}}", c.getPais() != null ? c.getPais() : "")
                .replace("{{telefone}}", c.getTelefone() != null ? c.getTelefone() : "")
                .replace("{{email}}", c.getEmail() != null ? c.getEmail() : "")
                .replace("{{tipoPessoa}}", c.getTipoPessoa() != null ? c.getTipoPessoa() : "")
                .replace("{{homePage}}", c.getHomePage() != null ? c.getHomePage() : "")
                .replace("{{dataAbertura}}", c.getDataAbertura() != null ? c.getDataAbertura().toString() : "");

        MimeMessage mensagem = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

        helper.setTo(emailDto.getEmailDestino());
        helper.setSubject("Cadastro de Cliente Realizado");
        helper.setText(html, true);

        self.realizarEnvioAssincrono(mensagem, emailDto.getEmailDestino());
        logger.info("Solicitação de envio de e-mail para {} encaminhada para processamento assíncrono.",
                emailDto.getEmailDestino());
    }

   
    @Async
    public void realizarEnvioAssincrono(MimeMessage mimeMessage, String emailDestino) {
        logger.info("Iniciando envio assíncrono para: {}", emailDestino);
        try {
            mailSender.send(mimeMessage);
            logger.info("E-mail de cadastro enviado com sucesso (assíncrono) para: {}", emailDestino);
        } catch (Exception e) {
            logger.error("Falha ao enviar e-mail de cadastro (assíncrono) para: {}. Erro: {}", emailDestino,
                    e.getMessage(), e);
        }
        logger.info("Finalizado processamento assíncrono para: {}", emailDestino);
    }
}
