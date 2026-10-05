-- ============================================================
-- ESTADO ATIVO E CONSISTENCIA DE VINCULACAO DAS NFs
-- ============================================================

ALTER TABLE nf
    ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_nf_ativo
    ON nf (ativo);

-- Recalcula o estado das NFs existentes com base nas entradas ativas.
UPDATE nf n
SET nf_vinculada = EXISTS (
    SELECT 1
    FROM entrada e
    WHERE e.nf_id = n.id
      AND e.ativo = TRUE
);

-- Garante que as NFs existentes continuem ativas após a migration.
UPDATE nf
SET ativo = TRUE
WHERE ativo IS NULL;
