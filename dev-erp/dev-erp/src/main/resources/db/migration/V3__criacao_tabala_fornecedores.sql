-- ==========================================
-- TABELA: FORNECEDORES
-- ==========================================

CREATE TABLE fornecedores (
    id BIGSERIAL PRIMARY KEY,

    razao_social VARCHAR(150) NOT NULL,

    nome_fantasia VARCHAR(150),

    inscricao_estadual VARCHAR(30),

    cnpj VARCHAR(18) NOT NULL UNIQUE,

    telefone VARCHAR(20),

    email VARCHAR(150),

    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    data_update TIMESTAMP,

    ativo BOOLEAN NOT NULL DEFAULT TRUE
);