package com.devteciot.API_erp.Models.ModelProdutos;

import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.devteciot.API_erp.Models.ModelNf.ModelNF;
import com.devteciot.API_erp.Models.ModelXML.Produto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
@Table(name = "tb_produtos_nf")
public class ModelTbProdutosNf extends Produto {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @ManyToOne
 @JoinColumn(name = "nf_id")
 private ModelNF nf;

 @ManyToOne
 @JoinColumn(name = "produto_link_id")
 private ModelTbProdutos produtoRelacionado;

 @CreatedDate
 @Column(name = "data_criacao", updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_atualizacao")
 private LocalDateTime dataAtualizacao;
}
