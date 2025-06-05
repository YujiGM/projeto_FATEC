# API de Gerenciamento de Clientes e Usuários (API Projeto Engenharia)
 
## 📜 Descrição
 
Esta é uma API RESTful desenvolvida como parte de um projeto de engenharia de software e programação WEB. A API gerencia entidades como Clientes e Usuários, oferece autenticação via JWT, integração com APIs externas para consulta de CNPJ (BrasilAPI) e CEP (ViaCEP), e funcionalidade de envio de e-mails (Gmail) após o cadastro de clientes. O projeto também inclui uma interface frontend (HTML, CSS, JavaScript) para interagir com a API.
 
## 🚀 Tecnologias Utilizadas
 
### Backend
- Java 17
- Spring Boot 3.4.5
- Spring MVC (Web)
- Spring Data JPA (Persistência)
- Spring Security (Segurança)
- JWT (JSON Web Tokens para autenticação)
- Hibernate (Implementação JPA)
- MySQL (Banco de Dados principal)
- H2 (Banco de Dados em memória)
- Maven (Gerenciamento de dependências e build)
- Spring Boot Mail Sender (Envio de e-mails)
- SpringDoc OpenAPI (Documentação da API - Swagger UI)
 
### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS para manipulação do DOM e chamadas AJAX/Fetch)
- Bootstrap 5.3
- Bootstrap Icons
- EmailJS (identificado no script da `tela_cadastrar.html`, embora a funcionalidade principal de email seja via backend)
 
## ✨ Funcionalidades Principais
 
-   **Autenticação de Usuários:** Login com geração de token JWT.
-   **Gerenciamento de Usuários (CRUD):** Criar, Listar, Buscar, Atualizar, Deletar usuários.
    -   Criação de usuário "admin" padrão na inicialização se nenhum usuário existir (usuário: `admin`, senha: `123456`).
-   **Gerenciamento de Clientes (CRUD):** Criar, Listar, Buscar, Atualizar, Deletar clientes.
    -   Pesquisa multicritério de clientes (CNPJ/CPF, código do cliente, nome, município).
-   **Gerenciamento de Fiscal:** Cadastro do e-mail do fiscal para recebimento de notificações.
-   **Consulta de CNPJ:** Integração com BrasilAPI para buscar dados de empresas.
-   **Consulta de CEP:** Integração com ViaCEP para buscar dados de endereços.
-   **Envio de E-mail:** Envio de e-mail de confirmação/boas-vindas após cadastro de cliente, utilizando template HTML (`email-cadastro.html`).
    -   Os e-mails são enviados de forma assíncrona (`@EnableAsync` na aplicação, `@Async` no serviço de email).
-   **Documentação da API:** Disponível via Swagger UI.
-   **Tratamento Global de Exceções.**
-   **Frontend:** Telas para login, cadastro/listagem/alteração de clientes e usuários.
 
## 📂 Estrutura do Projeto (Backend - Simplificada)
 
-   `com.engenharia.projeto.api_projeto_engenharia`
    -   `config`: Configurações (Swagger).
    -   `controllers`: Controladores REST para cada entidade/funcionalidade.
    -   `domain`: Lógica de negócio (Services) e acesso a dados (Repositories).
    -   `entities`: Modelos de dados JPA (Cliente, Fiscal, Usuario).
    -   `exception`: Tratamento de exceções.
    -   `infrastructure`: Integração com serviços externos (ViaCEP, BrasilAPI, JavaMailSender).
    -   `security`: Configuração de segurança, JWT, UserDetails.
-   `resources`
    -   `templates`: Contém o template HTML para e-mails (`email-cadastro.html`).
    -   `application.properties`: Configurações da aplicação (banco de dados, porta, e-mail).
 
## 🌐 APIs Externas Utilizadas
 
-   **ViaCEP** (`https://viacep.com.br/`): Para consulta de endereços a partir do CEP.
-   **BrasilAPI** (`https://brasilapi.com.br/`): Para consulta de dados de CNPJ.
 
## 🛠️ Configuração e Execução (Backend)
 
### 1. Pré-requisitos
-   JDK 17 ou superior.
-   Maven.
-   MySQL Server (ou XAMPP/WAMP com MySQL).
-   Uma conta Gmail configurada para permitir "Acesso a app menos seguro" ou uma senha de aplicativo, se a autenticação de 2 fatores estiver ativa (para a funcionalidade de envio de e-mail).
 
### 2. Banco de Dados
-   A API está configurada para usar MySQL no `localhost`, porta `3306`.
-   Nome do banco: `projeto_engenharia` (será criado automaticamente se não existir: `createDatabaseIfNotExist=true`).
-   Usuário: `root`, Senha: `""` (vazia).
-   Estas configurações estão em `src/main/resources/application.properties`. Ajuste conforme necessário.
 
### 3. Configuração de E-mail
-   O envio de e-mail está configurado para usar uma conta Gmail: `emailteste@email.com`.
-   A senha está no arquivo `application.properties`.
    > ⚠️ **Importante:** É altamente recomendável não commitar senhas reais em repositórios. Utilize variáveis de ambiente ou Spring Cloud Config em produção.
-   Para que o Gmail funcione, pode ser necessário habilitar "Acesso a app menos seguro" na conta Google ou gerar uma "Senha de aplicativo".
 
### 4. Execução
-   Navegue até o diretório `api-projeto-engenharia`.
-   Execute o arquivo: `ApiProjetoEngenhariaApplication.java`.
-   Execute o Apache e o MySQL do XAMPP.
-   A API estará disponível em `http://localhost/projeto-engenharia/` .
 
### 5. Documentação da API (Swagger)
-   Após iniciar a aplicação, acesse: `http://localhost:9856/swagger-ui.html`
 
## 👤 Usuário Padrão
 
Na primeira inicialização, se não houver usuários no banco, um usuário "admin" é criado com as seguintes credenciais:
-   **Nome de usuário (login):** `admin`
-   **Senha:** `123456`
-   **Email:** `admin@email.com`
 
## 🖥️ Frontend
 
-   As telas HTML (`tela_*.html`) podem ser abertas diretamente no navegador (ex: `file:///path/to/projeto_engenharia-main/tela_login.html`).
-   Elas consomem a API backend que deve estar em execução.
-   **Telas disponíveis:**
    -   Login (`tela_login.html`)
    -   Listagem de Clientes (`tela_listar.html`)
    -   Cadastro de Clientes (`tela_cadastrar.html`)
    -   Alteração de Clientes (`tela_alterar.html`)
    -   Listagem de Usuários (`tela_listar_usuario.html`)
    -   Cadastro de Usuários (`tela_cadastrar_usuario.html`)
    -   Alteração de Usuários (`tela_alterar_usuario.html`)
 
## 📝 Observações Adicionais
 
-   O projeto utiliza CORS configurado para permitir todas as origens (`*`) e métodos comuns.
-   LiveReload está habilitado via `spring-boot-devtools`.
Sriganesh Sureshkumar
Software Engineer
 
