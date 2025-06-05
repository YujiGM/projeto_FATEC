package com.engenharia.projeto.api_projeto_engenharia.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.engenharia.projeto.api_projeto_engenharia.infrastructure.cnpjbrasil.CnpjDto;
import com.engenharia.projeto.api_projeto_engenharia.infrastructure.cnpjbrasil.CnpjService;

@RestController
@RequestMapping("/cnpj")
public class CnpjController {
    @Autowired
    private CnpjService cnpjService;

    @GetMapping("/{cnpj}")
    public CnpjDto buscarCnpj(@PathVariable String cnpj) {
        return cnpjService.buscarPorCnpj(cnpj);
    }

}
