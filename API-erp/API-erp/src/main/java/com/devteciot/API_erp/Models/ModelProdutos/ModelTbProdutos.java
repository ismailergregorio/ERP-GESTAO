package com.devteciot.API_erp.Models.ModelProdutos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.devteciot.API_erp.Models.ModelTbCategoria;
import com.devteciot.API_erp.Models.ModelTbUnidadeMedida;
import com.devteciot.API_erp.Models.ModelXML.Produto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_produtos")
@EntityListeners(AuditingEntityListener.class)
public class ModelTbProdutos {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(name = "nome", nullable = false, unique = true, length = 150)
 private String nome;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "unidade_medida_id", nullable = false)
 private ModelTbUnidadeMedida unidadeMedida;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "categoria_id", nullable = false)
 private ModelTbCategoria categoria;

 @Column(name = "valor_unitario", precision = 12, scale = 2)
 private BigDecimal valorUnitario = BigDecimal.ZERO;

 @OneToMany(mappedBy = "produtoRelacionado")
 private List<Produto> linkProdutos;

 @Column(name = "estoque")
 private Integer estoque = 0;

 @Column(name = "est_min")
 private Integer estoqueMinimo = 0;

 @Column(name = "est_max")
 private Integer estoqueMaximo = 0;

 @Column(name = "ativo")
 private Boolean ativo = true;

 @CreatedDate
 @Column(name = "data_criacao", updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_atualizacao")
 private LocalDateTime dataAtualizacao;
}
