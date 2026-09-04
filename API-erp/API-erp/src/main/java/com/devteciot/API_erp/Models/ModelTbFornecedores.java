package com.devteciot.API_erp.Models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.devteciot.API_erp.Models.ModelNf.ModelNF;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_fornecedor")
@EntityListeners(AuditingEntityListener.class)
public class ModelTbFornecedores {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(name = "razao_social", length = 150)
 private String razaoSocial;

 @Column(name = "nome_fantasia", length = 150)
 private String nomeFantasia;

 @Column(name = "incricao_estadual", unique = true, length = 150)
 private String inscricaoEstadual;

 @Column(name = "cnpj", nullable = false, unique = true, length = 18)
 private String cnpj;

 @Column(name = "telefone", nullable = false, length = 20)
 private String telefone;

 @Column(name = "email", nullable = false, length = 150)
 private String email;

 @OneToMany(mappedBy = "fornecedor")
 private List<ModelNF> nfs = new ArrayList<>();

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_atualizacao")
 private LocalDateTime dataAtualizacao;
}
