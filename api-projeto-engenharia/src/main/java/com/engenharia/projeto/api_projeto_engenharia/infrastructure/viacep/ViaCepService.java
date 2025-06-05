package com.engenharia.projeto.api_projeto_engenharia.infrastructure.viacep;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ViaCepService {

    private final RestTemplate restTemplate = new RestTemplate();

    public EnderecoDto buscarPorCep(String cep) {
        String url = "https://viacep.com.br/ws/" + cep + "/json/";
        return restTemplate.getForObject(url, EnderecoDto.class);
    }
}
