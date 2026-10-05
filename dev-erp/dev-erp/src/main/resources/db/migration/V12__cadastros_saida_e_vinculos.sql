CREATE TABLE IF NOT EXISTS funcionarios (
 id BIGSERIAL PRIMARY KEY,
 nome VARCHAR(150) NOT NULL,
 cpf VARCHAR(30) UNIQUE,
 ativo BOOLEAN NOT NULL DEFAULT TRUE,
 data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 data_update TIMESTAMP NULL
);
CREATE TABLE IF NOT EXISTS setores (
 id BIGSERIAL PRIMARY KEY,
 nome VARCHAR(150) NOT NULL UNIQUE,
 ativo BOOLEAN NOT NULL DEFAULT TRUE,
 data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 data_update TIMESTAMP NULL
);
CREATE TABLE IF NOT EXISTS tipos_saidas (
 id BIGSERIAL PRIMARY KEY,
 nome VARCHAR(150) NOT NULL UNIQUE,
 ativo BOOLEAN NOT NULL DEFAULT TRUE,
 data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 data_update TIMESTAMP NULL
);
ALTER TABLE saidas ADD COLUMN IF NOT EXISTS funcionario_id BIGINT;
ALTER TABLE saidas ADD COLUMN IF NOT EXISTS setor_id BIGINT;
ALTER TABLE saidas ADD COLUMN IF NOT EXISTS tipo_saida_id BIGINT;
INSERT INTO tipos_saidas (nome) VALUES ('Uso interno') ON CONFLICT (nome) DO NOTHING;
INSERT INTO funcionarios (nome)
SELECT DISTINCT TRIM(funcionario) FROM saidas WHERE funcionario IS NOT NULL AND TRIM(funcionario) <> ''
ON CONFLICT DO NOTHING;
INSERT INTO setores (nome)
SELECT DISTINCT TRIM(setor) FROM saidas WHERE setor IS NOT NULL AND TRIM(setor) <> ''
ON CONFLICT DO NOTHING;
UPDATE saidas s SET funcionario_id=f.id FROM funcionarios f WHERE s.funcionario_id IS NULL AND TRIM(s.funcionario)=f.nome;
UPDATE saidas s SET setor_id=st.id FROM setores st WHERE s.setor_id IS NULL AND TRIM(s.setor)=st.nome;
UPDATE saidas s SET tipo_saida_id=t.id FROM tipos_saidas t WHERE s.tipo_saida_id IS NULL AND t.nome='Uso interno';
ALTER TABLE saidas ADD CONSTRAINT fk_saidas_funcionario FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id);
ALTER TABLE saidas ADD CONSTRAINT fk_saidas_setor FOREIGN KEY (setor_id) REFERENCES setores(id);
ALTER TABLE saidas ADD CONSTRAINT fk_saidas_tipo_saida FOREIGN KEY (tipo_saida_id) REFERENCES tipos_saidas(id);
CREATE INDEX idx_saidas_funcionario_id ON saidas(funcionario_id);
CREATE INDEX idx_saidas_setor_id ON saidas(setor_id);
CREATE INDEX idx_saidas_tipo_saida_id ON saidas(tipo_saida_id);
