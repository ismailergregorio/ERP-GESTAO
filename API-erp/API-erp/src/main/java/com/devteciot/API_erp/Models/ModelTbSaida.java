package com.devteciot.API_erp.Models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_saida")
@EntityListeners(AuditingEntityListener.class)
public class ModelTbSaida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_id", nullable = false)
    private ModelTbFuncionario funcionario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_saida_id", nullable = false)
    private ModelTbTipoSaida tipoSaida;

    @Column(name = "obs", length = 150)
    private String observacao;

    @CreatedDate
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @LastModifiedDate
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;
}