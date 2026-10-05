-- ============================================================
-- DESATIVAÇÃO LÓGICA DAS ENTRADAS
-- ============================================================

ALTER TABLE entrada
    ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_entrada_ativo
    ON entrada (ativo);
