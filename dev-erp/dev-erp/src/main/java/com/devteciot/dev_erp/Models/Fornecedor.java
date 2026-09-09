package com.devteciot.dev_erp.Models;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "fornecedores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Fornecedor {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(name = "razao_social", nullable = false, length = 150)
 private String razaoSocial;

 @Column(name = "nome_fantasia", length = 150)
 private String nomeFantasia;

 @Column(name = "inscricao_estadual", length = 30)
 private String inscricaoEstadual;

 @Column(nullable = false, length = 18, unique = true)
 private String cnpj;

 @Column(length = 20)
 private String telefone;

 @Column(length = 150)
 private String email;

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_update")
 private LocalDateTime dataUpdate;

 @Column(nullable = false)
 private Boolean ativo = true;
}