package com.devteciot.API_erp.Models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_entrada")
@EntityListeners(AuditingEntityListener.class)
public class ModelTbEntrada {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(name = "nota_fiscal", nullable = false)
 private Integer notaFiscal;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "fornecedor_id", nullable = false)
 private ModelTbFornecedores fornecedor;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "tipo_entrada_id", nullable = false)
 private ModelTbTipoEntrada tipoEntrada;

 @Column(name = "observacao", length = 250)
 private String observacao;

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_atualizacao")
 private LocalDateTime dataAtualizacao;
}
