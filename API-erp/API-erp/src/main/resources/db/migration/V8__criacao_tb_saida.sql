CREATE TABLE tb_saida(
 id BIGSERIAL PRIMARY KEY,
 funcionario_id BIGINT NOT NULL,
 tipo_saida_id  BIGINT NOT NULL,
 obs VARCHAR(150),
 data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 data_atualizacao TIMESTAMP,

 CONSTRAINT fk_saida_funcionario
  FOREIGN KEY (funcionario_id)
  REFERENCES tb_funcionario(id),
 
 CONSTRAINT fk_saida_tipo_saida
  FOREIGN KEY (tipo_saida_id )
  REFERENCES tb_tipo_saida(id)
);

CREATE TABLE tb_saida_produtos(
 id BIGSERIAL PRIMARY KEY,
 saida_id BIGINT NOT NULL,
 produto_id BIGINT NOT NULL,
 quantidade INT NOT NULL,
 valor_unitario NUMERIC(12,2) NOT NULL,
 valor_total NUMERIC(12,2) NOT NULL,
 data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 data_atualizacao TIMESTAMP,

 CONSTRAINT fk_saida_produto_saida
  FOREIGN KEY (saida_id)
  REFERENCES tb_saida(id),
 
 CONSTRAINT fk_saida_produtos_produto
  FOREIGN KEY (produto_id)
  REFERENCES tb_produtos(id)
);