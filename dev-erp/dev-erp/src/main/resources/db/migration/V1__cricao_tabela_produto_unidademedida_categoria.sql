-- ==========================================
-- TABELA: CATEGORIA
-- ==========================================

CREATE TABLE categoria (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_update TIMESTAMP,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);


-- ==========================================
-- TABELA: UNIDADE_MEDIDA
-- ==========================================

CREATE TABLE unidade_medida (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_update TIMESTAMP,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    sigla VARCHAR(10) NOT NULL
);


-- ==========================================
-- TABELA: PRODUTOS
-- ==========================================

CREATE TABLE produtos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,

    unidade_medida_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,

    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_update TIMESTAMP,

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    estoque INTEGER NOT NULL DEFAULT 0,
    est_min INTEGER NOT NULL DEFAULT 0,
    est_max INTEGER NOT NULL DEFAULT 0,

    valor_unitario NUMERIC(15,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT fk_produto_unidade_medida
        FOREIGN KEY (unidade_medida_id)
        REFERENCES unidade_medida(id),

    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categoria(id)
);