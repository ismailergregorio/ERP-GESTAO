CREATE TABLE IF NOT EXISTS usuarios_acesso (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    nome_usuario VARCHAR(60) NOT NULL,
    senha_hash VARCHAR(100) NOT NULL,
    perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('ADMIN', 'ESTOQUISTA', 'CONSULTA')),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    trocar_senha BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP,
    CONSTRAINT uk_usuarios_acesso_nome_usuario UNIQUE (nome_usuario)
);
CREATE INDEX IF NOT EXISTS idx_usuarios_acesso_ativo ON usuarios_acesso (ativo);
