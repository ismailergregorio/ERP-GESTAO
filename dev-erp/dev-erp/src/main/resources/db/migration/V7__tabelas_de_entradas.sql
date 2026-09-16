CREATE TABLE tipos_entradas (
    id BIGSERIAL PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    data_update TIMESTAMP
);

CREATE TABLE entrada (
    id BIGSERIAL PRIMARY KEY,

    tipos_entrada_id BIGINT NOT NULL,

    obs VARCHAR(500),

    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    data_update TIMESTAMP,

    nf_id BIGINT,

    CONSTRAINT fk_entrada_tipo
        FOREIGN KEY (tipos_entrada_id)
        REFERENCES tipos_entradas(id),

    CONSTRAINT fk_entrada_nf
        FOREIGN KEY (nf_id)
        REFERENCES nf(id)
);

CREATE TABLE tb_entrada_produtos (
    id BIGSERIAL PRIMARY KEY,

    entrada_id BIGINT NOT NULL,

    produto_id BIGINT NOT NULL,

    quant_itens INTEGER NOT NULL,

    valor_uni NUMERIC(15,2) NOT NULL,

    valor_total NUMERIC(15,2) NOT NULL,

    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    data_update TIMESTAMP,

    user_id BIGINT,

    CONSTRAINT fk_entrada_produtos_entrada
        FOREIGN KEY (entrada_id)
        REFERENCES entrada(id),

    CONSTRAINT fk_entrada_produtos_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
);