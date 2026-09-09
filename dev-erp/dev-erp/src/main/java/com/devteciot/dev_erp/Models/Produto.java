package com.devteciot.dev_erp.Models;

import java.math.BigDecimal;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "produtos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Produto {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(nullable = false, length = 150)
 private String nome;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "unidade_medida_id", nullable = false)
 private UnidadeMedida unidadeMedida;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "categoria_id", nullable = false)
 private Categoria categoria;

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_update")
 private LocalDateTime dataUpdate;

 @Column(nullable = false)
 private Boolean ativo = true;

 @Column(nullable = false)
 private Integer estoque = 0;

 @Column(name = "est_min", nullable = false)
 private Integer estoqueMinimo = 0;

 @Column(name = "est_max", nullable = false)
 private Integer estoqueMaximo = 0;

 @Column(name = "valor_unitario", nullable = false, precision = 15, scale = 2)
 private BigDecimal valorUnitario;
}
