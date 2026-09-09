package com.devteciot.dev_erp.Models;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "produtos_registro_nf")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ProdutoRegistroNF {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(nullable = false, length = 100)
 private String codigo;

 @Column(nullable = false, length = 255)
 private String descricao;

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_update")
 private LocalDateTime dataUpdate;

 @Column(nullable = false)
 private Boolean ativo = true;

 @Column(nullable = false, length = 20)
 private String unidade;

 @Column(name = "quant",nullable = false, precision = 15, scale = 3)
 private BigDecimal quantidade;

 @Column(name = "valor_unitario", nullable = false, precision = 15, scale = 2)
 private BigDecimal valorUnitario;

 @Column(name = "valor_total", nullable = false, precision = 15, scale = 2)
 private BigDecimal valorTotal;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "nf_id", nullable = false)
 private NotaFiscal nf;
}