package com.devteciot.API_erp.Models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.devteciot.API_erp.Models.ModelEntrada.ModelTbEntradaProduto;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutos;
import com.devteciot.API_erp.Models.ModelSaida.ModelTbSaida;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_movimentacao")
@EntityListeners(AuditingEntityListener.class)
public class ModelTbMovimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private ModelTbProdutos produto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entrada_produto_id")
    private ModelTbEntradaProduto entradaProduto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saida_produto_id")
    private ModelTbSaida saidaProduto;

    @Column(name = "tipo_movimentacao", nullable = false, length = 20)
    private String tipoMovimentacao;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @Column(name = "saldo_anterior", nullable = false)
    private Integer saldoAnterior;

    @Column(name = "saldo_atual", nullable = false)
    private Integer saldoAtual;

    @CreatedDate
    @Column(name = "data_movimentacao", nullable = false, updatable = false)
    private LocalDateTime dataMovimentacao;
}