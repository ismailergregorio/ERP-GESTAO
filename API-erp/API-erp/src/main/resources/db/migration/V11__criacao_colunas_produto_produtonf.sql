ALTER TABLE tb_produtos_nf
ADD COLUMN produto_link_id BIGINT;

ALTER TABLE tb_produtos_nf
ADD CONSTRAINT fk_tb_produtos_nf_produto_link
FOREIGN KEY (produto_link_id)
REFERENCES tb_produtos(id);