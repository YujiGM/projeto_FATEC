package com.engenharia.projeto.api_projeto_engenharia.entities;

import java.sql.Date;


import jakarta.persistence.*;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cod_cliente", nullable = false, length = 6)
    private String codCliente;

    @Column(name = "tipo_pessoa", nullable = false, length = 1)
    private String tipoPessoa;

    @Column(nullable = false, length = 1)
    private String tipo;

    @Column(name = "cnpj_cpf", nullable = false, length = 18)
    private String cnpjCpf;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "nome_fantasia", nullable = false, length = 100)
    private String nomeFantasia;

    @Column(nullable = false, length = 2)
    private String loja;

    @Column(name = "data_abertura", nullable = false)
    private Date dataAbertura;

    @Column(nullable = false, length = 9)
    private String cep;

    @Column(nullable = true, length = 10)
    private String numero;

    @Column(nullable = false, length = 100)
    private String endereco;

    @Column(nullable = true, length = 40)
    private String bairro;

    @Column(name = "cod_municipio", nullable = true, length = 10)
    private String codMunicipio;

    @Column(nullable = false, length = 100)
    private String municipio;

    @Column(nullable = false, length = 2)
    private String estado;

    @Column(nullable = true, length = 40)
    private String pais;

    @Column(nullable = true, length = 20)
    private String telefone;

    @Column(nullable = true, length = 100)
    private String email;

    @Column(name = "home_page", nullable = true, length = 50)
    private String homePage;

    public Cliente() {
    }

    public Cliente(Integer id, String codCliente, String tipoPessoa, String tipo, String cnpjCpf, String nome,
            String nomeFantasia, String loja, Date dataAbertura, String cep, String numero, String endereco,
            String bairro, String codMunicipio, String municipio, String estado, String pais,
            String telefone, String email, String homePage) {
        this.id = id;
        this.codCliente = codCliente;
        this.tipoPessoa = tipoPessoa;
        this.tipo = tipo;
        this.cnpjCpf = cnpjCpf;
        this.nome = nome;
        this.nomeFantasia = nomeFantasia;
        this.loja = loja;
        this.dataAbertura = dataAbertura;
        this.cep = cep;
        this.numero = numero;
        this.endereco = endereco;
        this.bairro = bairro;
        this.codMunicipio = codMunicipio;
        this.municipio = municipio;
        this.estado = estado;
        this.pais = pais;
        this.telefone = telefone;
        this.email = email;
        this.homePage = homePage;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCodCliente() {
        return codCliente;
    }

    public void setCodCliente(String codCliente) {
        this.codCliente = codCliente;
    }

    public String getTipoPessoa() {
        return tipoPessoa;
    }

    public void setTipoPessoa(String tipoPessoa) {
        this.tipoPessoa = tipoPessoa;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getCnpjCpf() {
        return cnpjCpf;
    }

    public void setCnpjCpf(String cnpjCpf) {
        this.cnpjCpf = cnpjCpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public String getLoja() {
        return loja;
    }

    public void setLoja(String loja) {
        this.loja = loja;
    }

    public Date getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(Date dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCodMunicipio() {
        return codMunicipio;
    }

    public void setCodMunicipio(String codMunicipio) {
        this.codMunicipio = codMunicipio;
    }

    public String getMunicipio() {
        return municipio;
    }

    public void setMunicipio(String municipio) {
        this.municipio = municipio;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHomePage() {
        return homePage;
    }

    public void setHomePage(String homePage) {
        this.homePage = homePage;
    }
}