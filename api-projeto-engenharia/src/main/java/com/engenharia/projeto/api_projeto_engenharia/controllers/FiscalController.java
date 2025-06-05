package com.engenharia.projeto.api_projeto_engenharia.controllers;

import org.springframework.web.bind.annotation.*;

import com.engenharia.projeto.api_projeto_engenharia.domain.fiscal.FiscalService;
import com.engenharia.projeto.api_projeto_engenharia.entities.Fiscal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/fiscal")
public class FiscalController {
    @Autowired

    private FiscalService fiscalService;
    private static final Logger logger = LoggerFactory.getLogger(FiscalController.class.getName());

    @PostMapping("/criarFiscal")
    public ResponseEntity<Fiscal> criarFiscal(@RequestBody Fiscal fiscal) {
        Fiscal novoFiscal = fiscalService.criarFiscal(fiscal);
        logger.info("Fiscal criado: ID={}, Email={}", novoFiscal.getId(), novoFiscal.getEmail());
        return new ResponseEntity<>(novoFiscal, HttpStatus.CREATED);
    }

    @GetMapping("/listarFiscais")
    public ResponseEntity<List<Fiscal>> listarFiscais() {
        List<Fiscal> fiscais = fiscalService.listarFiscais();
        return new ResponseEntity<>(fiscais, HttpStatus.OK);
    }

    @GetMapping("/buscarFiscal/{id}")
    public ResponseEntity<Fiscal> buscarFiscalPorId(@PathVariable Long id) {
        Fiscal fiscal = fiscalService.buscarFiscalPorId(id);
        return ResponseEntity.ok(fiscal);
    }

    @PutMapping("/atualizarFiscal/{id}")
    public ResponseEntity<Fiscal> atualizarFiscal(@PathVariable Long id, @RequestBody Fiscal fiscalAtualizado) {
        Fiscal fiscal = fiscalService.atualizarFiscal(id, fiscalAtualizado);
        return ResponseEntity.ok(fiscal);
    }

    @DeleteMapping("/deletarFiscal/{id}")
    public void deletarFiscal(@PathVariable Long id) {
        fiscalService.deletarFiscal(id);
    }
}
