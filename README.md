# Sistema de Gestão de Clientes 👨‍💼

Este projeto é um sistema web para gestão de clientes (CRUD), com um backend em Java/Spring Boot e um frontend em HTML/CSS/JS.

## Tecnologias Utilizadas 🛠️

* **Backend ☕:**
    * Java 17 & Spring Boot
    * Spring Security & JWT
    * JPA / Hibernate
    * MySQL
    * Maven

* **Frontend 💻:**
    * HTML, CSS, JavaScript
    * Bootstrap 5

## Principais Funcionalidades ✨

* 🔐 Login de usuários com autenticação via token JWT.
* 👥 Cadastro, consulta, alteração e exclusão de clientes e usuários.
* 📫 Preenchimento automático de endereço por CEP (ViaCEP).
* 🏢 Preenchimento automático de dados de empresa por CNPJ (BrasilAPI).
* 📧 Envio de e-mail de notificação ao cadastrar um novo cliente.
* 🔍 Pesquisa com paginação nas telas de listagem.

## Como Executar 🚀

### 1. Backend (API)

1.  **Configuração**:
    * Abra a pasta do projeto `api-projeto-engenharia`.
    * Acesse o arquivo `src/main/resources/application.properties`.
    * **Altere as linhas** `spring.datasource.url`, `spring.datasource.username` e `spring.datasource.password` com os dados do seu banco de dados MySQL local.
    * **Altere as linhas** `spring.mail.username` e `spring.mail.password` para as suas credenciais de e-mail.

2.  **Execução**:
    * Abra um terminal na pasta `api-projeto-engenharia`.
    * Execute o comando: `mvn spring-boot:run`
    * A API estará rodando no endereço `http://localhost:9856`.

### 2. Frontend

1.  Com o backend em execução, abra o arquivo `tela_login.html` diretamente no seu navegador.

## Acesso e Documentação da API 🔑

* **Login Padrão**:
    * **Usuário**: `admin`
    * **Senha**: `123456`
    * _*Este usuário é criado automaticamente na primeira vez que a API é iniciada._

* **Documentação (Swagger)**:
    * Para ver todos os endpoints da API e testá-los, acesse:
    * **URL**: `http://localhost:9856/swagger-ui.html`