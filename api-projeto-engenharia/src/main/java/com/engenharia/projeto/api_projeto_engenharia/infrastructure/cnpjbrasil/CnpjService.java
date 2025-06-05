package com.engenharia.projeto.api_projeto_engenharia.infrastructure.cnpjbrasil;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class CnpjService {
    private final RestTemplate restTemplate = new RestTemplate();

    public CnpjDto buscarPorCnpj(String cnpj) {
          String url = "https://brasilapi.com.br/api/cnpj/v1/" + cnpj;
    String response = restTemplate.getForObject(url, String.class); // recebe como texto
    ObjectMapper mapper = new ObjectMapper();
    try {
        return mapper.readValue(response, CnpjDto.class);
    } catch (JsonProcessingException e) {
        throw new RuntimeException("Erro ao desserializar resposta da API", e);
    }
    }
}
