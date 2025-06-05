package com.engenharia.projeto.api_projeto_engenharia.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "fiscal")
public class Fiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    public Fiscal() {
    }

    public Fiscal(String email) {

        this.email = email;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}