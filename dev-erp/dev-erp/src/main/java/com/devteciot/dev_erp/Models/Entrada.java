package com.devteciot.dev_erp.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "entrada")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Entrada {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "tipos_entrada_id", nullable = false)
 private TipoEntrada tipoEntrada;

 @Column(length = 500)
 private String obs;

 @CreatedDate
 @Column(name = "data_criacao", nullable = false, updatable = false)
 private LocalDateTime dataCriacao;

 @LastModifiedDate
 @Column(name = "data_update")
 private LocalDateTime dataUpdate;

 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "nf_id")
 private NotaFiscal nf;

 @Column(name = "numero_nf_manual", length = 60)
 private String numeroNFManual;

 @Column(name = "ativo", nullable = false)
 private Boolean ativo = true;
}