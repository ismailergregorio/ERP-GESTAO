-- Remove os campos legados da primeira versão da saída.
-- A partir desta migration, funcionário, setor e tipo de saída
-- são controlados exclusivamente por suas tabelas de cadastro.

ALTER TABLE saidas
    DROP COLUMN IF EXISTS funcionario;

ALTER TABLE saidas
    DROP COLUMN IF EXISTS setor;

ALTER TABLE saidas
    DROP COLUMN IF EXISTS responsavel;

-- Garante que os vínculos novos não possam ficar nulos.
-- Caso existam registros antigos sem vínculo, corrija-os antes de executar esta migration.
ALTER TABLE saidas
    ALTER COLUMN funcionario_id SET NOT NULL;

ALTER TABLE saidas
    ALTER COLUMN setor_id SET NOT NULL;

ALTER TABLE saidas
    ALTER COLUMN tipo_saida_id SET NOT NULL;
