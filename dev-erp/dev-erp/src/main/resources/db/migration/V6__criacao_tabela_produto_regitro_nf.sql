CREATE TABLE produtos_registro_nf (
    id BIGSERIAL PRIMARY KEY,

    codigo VARCHAR(100) NOT NULL,

    descricao VARCHAR(255) NOT NULL,

    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    data_update TIMESTAMP,

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    unidade VARCHAR(20) NOT NULL,

    quant NUMERIC(15, 3) NOT NULL,

    valor_unitario NUMERIC(15, 2) NOT NULL,

    valor_total NUMERIC(15, 2) NOT NULL,

    nf_id BIGINT NOT NULL,

    CONSTRAINT fk_produto_registro_nf
        FOREIGN KEY (nf_id)
        REFERENCES nf(id)
);