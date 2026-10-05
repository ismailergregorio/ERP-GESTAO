package com.devteciot.dev_erp.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_entrada_produtos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class EntradaProduto {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 /*
  * =====================================================
  * ENTRADA
  * =====================================================
  */

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "entrada_id", nullable = false)
 private Entrada entrada;

 /*
  * =====================================================
  * PRODUTO DO ESTOQUE
  * =====================================================
  */

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "produto_id", nullable = false)
 private Produto produto;

 /*
  * =====================================================
  * PRODUTO REGISTRADO NA NF
  * =====================================================
  */

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "id_produto_nf")
 private ProdutoRegistroNF produtoNF;

 /*
  * =====================================================
  * DATA DE VALIDADE
  * =====================================================
  */

 @Column(name = "data_de_validade")
 private LocalDate dataValidade;

 /*
  * =====================================================
  * QUANTIDADE
  * =====================================================
  */

 @Column(name = "quant_itens", nullable = false, precision = 15, scale = 2)
 private BigDecimal quantidadeItens;

 /*
  * =====================================================
  * VALOR UNITÁRIO
  * =====================================================
  */

 @Column(name = "valor_uni", nullable = false, precision = 15, scale = 2)
 private BigDecimal valorUnitario;

 /*
  * =====================================================
  * VALOR TOTAL
  * =====================================================
  */

 @Column(name = "valor_total", nullable = false, precision = 15, scale = 2)
 private BigDecimal valorTotal;

 /*
  * =====================================================
  * AUDITORIA
  * =====================================================
  */

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_update")
 private LocalDateTime dataUpdate;
}