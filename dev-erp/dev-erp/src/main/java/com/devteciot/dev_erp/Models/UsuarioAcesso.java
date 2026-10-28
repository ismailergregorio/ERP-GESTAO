package com.devteciot.dev_erp.Models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios_acesso")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UsuarioAcesso {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(name = "nome_usuario", nullable = false, unique = true, length = 60)
    private String nomeUsuario;

    @Column(name = "senha_hash", nullable = false, length = 100)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PerfilAcesso perfil;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "trocar_senha", nullable = false)
    private Boolean trocarSenha = true;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist void aoCriar() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = dataCriacao;
        if (ativo == null) ativo = true;
        if (trocarSenha == null) trocarSenha = true;
    }

    @PreUpdate void aoAtualizar() { dataAtualizacao = LocalDateTime.now(); }
}
