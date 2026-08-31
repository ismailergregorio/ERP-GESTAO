package com.devteciot.API_erp.Models.ModelNf;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutosNf;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.Data;

@Entity
@Data
@Table(name = "tb_nf")
public class ModelNF {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(name = "n_nf", nullable = false)
 private Integer nNF;

 @OneToMany(mappedBy = "nf", cascade = CascadeType.ALL, orphanRemoval = true)
 private List<ModelTbProdutosNf> produtos = new ArrayList<>();

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_atualizacao", nullable = false)
 private LocalDateTime dataAtualizacao;
}