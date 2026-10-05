package com.devteciot.dev_erp.Models;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Entity @Table(name="funcionarios") @Data @NoArgsConstructor @AllArgsConstructor @EntityListeners(AuditingEntityListener.class)
public class Funcionario {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=150) private String nome;
 @Column(length=30, unique=true) private String cpf;
 @Column(nullable=false) private Boolean ativo=true;
 @CreatedDate @Column(name="data_criacao",nullable=false,updatable=false) private LocalDateTime dataCriacao;
 @LastModifiedDate @Column(name="data_update") private LocalDateTime dataUpdate;
}
