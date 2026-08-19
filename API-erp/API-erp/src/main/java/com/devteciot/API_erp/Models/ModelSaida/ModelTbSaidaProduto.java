package com.devteciot.API_erp.Models.ModelSaida;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutos;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_saida_produtos")
@EntityListeners(AuditingEntityListener.class)
public class ModelTbSaidaProduto {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "saida_id", nullable = false)
 private ModelTbSaida saida_id;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "produto_id", nullable = false)
 private ModelTbProdutos produto_id;

 @Column(name = "quantidade", nullable = false)
 private Integer quantidade;

 @Column(name = "valor_unitario", nullable = false, precision = 12, scale = 2)
 private BigDecimal valorUnitario;

 @Column(name = "valor_total", nullable = false, precision = 12, scale = 2)
 private BigDecimal valorTotal;

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_atualizacao")
 private LocalDateTime dataAtualizacao;
}