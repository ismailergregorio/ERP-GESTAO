-- ==========================================
-- TABELA: NF
-- ==========================================

CREATE TABLE nf (
    id BIGSERIAL PRIMARY KEY,

    numero VARCHAR(50) NOT NULL,

    fornecedor_id BIGINT NOT NULL,

    chave_acesso VARCHAR(44) NOT NULL UNIQUE,

    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    data_update TIMESTAMP,

    CONSTRAINT fk_nf_fornecedor
        FOREIGN KEY (fornecedor_id)
        REFERENCES fornecedores(id)
);