CREATE TABLE tb_nf (
    id BIGSERIAL PRIMARY KEY,
    n_nf INTEGER NOT NULL,

    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_produtos_nf (
    id BIGSERIAL PRIMARY KEY,

    nf_id BIGINT NOT NULL,

    codigo VARCHAR(60),
    descricao VARCHAR(255),
    codigo_ean VARCHAR(20),
    ncm VARCHAR(20),
    cest VARCHAR(20),
    cfop VARCHAR(10),

    unidade_comercial VARCHAR(10),
    unidade_tributaria VARCHAR(10),

    quantidade NUMERIC(15,4),
    quantidade_tributaria NUMERIC(15,4),

    valor_unitario NUMERIC(15,4),
    valor_unitario_tributario NUMERIC(15,4),
    valor_total NUMERIC(15,2),

    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_produto_nf
        FOREIGN KEY (nf_id)
        REFERENCES tb_nf(id)
);