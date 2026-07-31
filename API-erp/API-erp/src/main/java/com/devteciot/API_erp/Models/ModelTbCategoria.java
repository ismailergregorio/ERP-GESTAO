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

@Entity
@Data
@Table(name = "tb_categoria")
@EntityListeners(AuditingEntityListener.class)
public class ModelTbCategoria {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(name = "nome", nullable = false, length = 100)
 private String nome;

 @Column(name = "ativo", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
 private Boolean ativo;
 
 @CreatedDate
 @Column(name = "data_criacao", nullable = false, length = 100)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_atualizacao", nullable = false, length = 100)
 private LocalDateTime dataAtualizacao;
}
