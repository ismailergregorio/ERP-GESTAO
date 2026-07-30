CREATE TABLE tb_movimentacao (
    id BIGSERIAL PRIMARY KEY,

    produto_id BIGINT NOT NULL,

    entrada_produto_id BIGINT,

    saida_produto_id BIGINT,

    tipo_movimentacao VARCHAR(20) NOT NULL,

    quantidade INT NOT NULL,

    saldo_anterior INT NOT NULL,

    saldo_atual INT NOT NULL,

    data_movimentacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimentacao_produto
        FOREIGN KEY (produto_id)
        REFERENCES tb_produtos(id),

    CONSTRAINT fk_movimentacao_entrada
        FOREIGN KEY (entrada_produto_id)
        REFERENCES tb_entrada_produtos(id),

    CONSTRAINT fk_movimentacao_saida
        FOREIGN KEY (saida_produto_id)
        REFERENCES tb_saida_produtos(id)
);