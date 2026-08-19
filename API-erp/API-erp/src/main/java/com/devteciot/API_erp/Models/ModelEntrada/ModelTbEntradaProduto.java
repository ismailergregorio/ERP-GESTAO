package com.devteciot.API_erp.Models.ModelEntrada;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutos;

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
@Table(name = "tb_entrada_produtos")
@EntityListeners(AuditingEntityListener.class)
public class ModelTbEntradaProduto {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "entrada_id", nullable = false)
 private ModelTbEntrada entrada;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "produto_id", nullable = false)
 private ModelTbProdutos produto;

 @Column(name = "quantidade", nullable = false)
 private Integer quantidade;

 @Column(name = "valor_uni", precision = 12, scale = 2)
 private BigDecimal valorUnitario = BigDecimal.ZERO;

 @Column(name = "valor_total", precision = 12, scale = 2)
 private BigDecimal valorTotal = BigDecimal.ZERO;

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_atualizacao")
 private LocalDateTime dataAtualizacao;
}
