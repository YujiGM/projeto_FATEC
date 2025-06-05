package com.engenharia.projeto.api_projeto_engenharia.controllers;

import com.engenharia.projeto.api_projeto_engenharia.infrastructure.viacep.EnderecoDto;
import com.engenharia.projeto.api_projeto_engenharia.infrastructure.viacep.ViaCepService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cep")
public class EnderecoController {

    @Autowired
    private ViaCepService viaCepService;

    @GetMapping("/{cep}")
    public EnderecoDto buscarEndereco(@PathVariable String cep) {
        return viaCepService.buscarPorCep(cep);
    }
}
