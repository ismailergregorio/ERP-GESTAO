package com.devteciot.dev_erp.Models;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.*;

@Entity @Table(name="saidas") @Data @NoArgsConstructor @AllArgsConstructor @EntityListeners(AuditingEntityListener.class)
public class Saida {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="funcionario_id",nullable=false) private Funcionario funcionario;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="setor_id",nullable=false) private Setor setor;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="tipo_saida_id",nullable=false) private TipoSaida tipoSaida;
 @Column(nullable=false,length=255) private String finalidade;
 @Column(length=500) private String obs;
 @Column(nullable=false) private Boolean ativo=true;
 @CreatedDate @Column(name="data_criacao",nullable=false,updatable=false) private LocalDateTime dataCriacao;
 @LastModifiedDate @Column(name="data_update") private LocalDateTime dataUpdate;
 @OneToMany(mappedBy="saida",cascade=CascadeType.ALL,orphanRemoval=true,fetch=FetchType.LAZY) private List<SaidaProduto> produtos=new ArrayList<>();
}
