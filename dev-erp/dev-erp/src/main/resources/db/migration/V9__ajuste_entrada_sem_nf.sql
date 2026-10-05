-- ============================================================
-- AJUSTES PARA ENTRADA SEM NOTA FISCAL
-- ============================================================

-- Produto da NF passa a ser opcional para entradas internas.
ALTER TABLE tb_entrada_produtos
    ALTER COLUMN id_produto_nf DROP NOT NULL;

-- Permite informar apenas o número da nota, sem cadastrar/vincular
-- uma Nota Fiscal completa.
ALTER TABLE entrada
    ADD COLUMN numero_nf_manual VARCHAR(60);

-- Tipo específico para entradas internas sem NF.
INSERT INTO tipos_entradas (nome)
SELECT 'Entrada sem Nota Fiscal'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipos_entradas
    WHERE LOWER(TRIM(nome)) = LOWER('Entrada sem Nota Fiscal')
);
