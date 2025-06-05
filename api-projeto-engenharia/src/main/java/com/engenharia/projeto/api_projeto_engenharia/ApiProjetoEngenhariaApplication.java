package com.engenharia.projeto.api_projeto_engenharia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ApiProjetoEngenhariaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiProjetoEngenhariaApplication.class, args);
	}

}
