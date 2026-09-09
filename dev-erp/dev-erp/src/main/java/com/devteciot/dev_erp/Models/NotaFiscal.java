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
@Table(name = "nf", uniqueConstraints = {
  @UniqueConstraint(name = "uk_nf_numero_fornecedor", columnNames = {
    "numero",
    "fornecedor_id"
  })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class NotaFiscal {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(nullable = false, length = 50)
 private String numero;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "fornecedor_id", nullable = false)
 private Fornecedor fornecedor;

 @Column(name = "chave_acesso", nullable = false, length = 44, unique = true)
 private String chaveAcesso;

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_update")
 private LocalDateTime dataUpdate;
}