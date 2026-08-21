ALTER TABLE tb_fornecedor
    ADD COLUMN razao_social VARCHAR(150),
    ADD COLUMN nome_fantasia VARCHAR(150),
    ADD COLUMN incricao_estadual VARCHAR(150);
 
ALTER TABLE tb_fornecedor
    DROP COLUMN nome;