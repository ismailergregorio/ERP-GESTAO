-- Classifica saídas especializadas e armazena a assinatura coletada na tela.
ALTER TABLE saidas ADD COLUMN IF NOT EXISTS saida_epi BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE saidas ADD COLUMN IF NOT EXISTS assinatura_funcionario BYTEA;
ALTER TABLE saidas ADD COLUMN IF NOT EXISTS data_assinatura TIMESTAMP;

-- Categorias padrão usadas para separar EPI/uniformes dos demais produtos.
INSERT INTO categoria (nome, ativo, data_criacao)
SELECT 'EPI', TRUE, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE LOWER(nome) = LOWER('EPI'));

INSERT INTO categoria (nome, ativo, data_criacao)
SELECT 'Uniforme', TRUE, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE LOWER(nome) = LOWER('Uniforme'));
