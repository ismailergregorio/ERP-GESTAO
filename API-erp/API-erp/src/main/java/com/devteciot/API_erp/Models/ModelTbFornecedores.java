package com.devteciot.API_erp.Models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

 @Column(name = "nome", nullable = false, unique = true, length = 150)
 private String nome;

 @Column(name = "cnpj", nullable = false, unique = true, length = 18)
 private String cnpj;

 @Column(name = "telefone", nullable = false, length = 20)
 private String telefone;

 @Column(name = "email", nullable = false, length = 150)
 private String email;

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_atualizacao")
 private LocalDateTime dataAtualizacao;
}
