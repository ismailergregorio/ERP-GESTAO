ALTER TABLE tb_nf
ADD COLUMN fornecedor_id BIGINT;

ALTER TABLE tb_nf
ADD CONSTRAINT fk_nf_fornecedor
FOREIGN KEY (fornecedor_id)
REFERENCES tb_fornecedor(id);

ALTER TABLE tb_produtos_nf
ADD CONSTRAINT fk_produto_nf_nf
FOREIGN KEY (nf_id)
REFERENCES tb_nf(id);