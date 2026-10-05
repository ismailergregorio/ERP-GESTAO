CREATE TABLE saidas (
    id BIGSERIAL PRIMARY KEY,
    funcionario VARCHAR(150) NOT NULL,
    setor VARCHAR(150) NOT NULL,
    finalidade VARCHAR(255) NOT NULL,
    responsavel VARCHAR(150) NOT NULL,
    obs VARCHAR(500),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_update TIMESTAMP,
    CONSTRAINT ck_saidas_ativo CHECK (ativo IN (TRUE, FALSE))
);

CREATE TABLE saida_produtos (
    id BIGSERIAL PRIMARY KEY,
    saida_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_unitario NUMERIC(15,2) NOT NULL,
    valor_total NUMERIC(15,2) NOT NULL,
    CONSTRAINT fk_saida_produto_saida
        FOREIGN KEY (saida_id) REFERENCES saidas(id),
    CONSTRAINT fk_saida_produto_produto
        FOREIGN KEY (produto_id) REFERENCES produtos(id),
    CONSTRAINT ck_saida_produto_quantidade
        CHECK (quantidade > 0)
);

CREATE INDEX idx_saidas_ativo ON saidas(ativo);
CREATE INDEX idx_saidas_data_criacao ON saidas(data_criacao);
CREATE INDEX idx_saida_produtos_saida_id ON saida_produtos(saida_id);
CREATE INDEX idx_saida_produtos_produto_id ON saida_produtos(produto_id);
