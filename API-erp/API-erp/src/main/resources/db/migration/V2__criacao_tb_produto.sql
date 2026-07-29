CREATE TABLE tb_produtos(
 id BIGSERIAL PRIMARY KEY,
 nome VARCHAR(150) NOT NULL UNIQUE,
 unidade_medida_id BIGINT NOT NULL,
 categoria_id BIGINT NOT NULL,
 valor_unitario NUMERIC(12,2) DEFAULT 0,
 estoque INT DEFAULT 0,
 est_min INT DEFAULT 0,
 est_max INT DEFAULT 0,
 ativo BOOLEAN DEFAULT TRUE,
 data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 data_atualizacao TIMESTAMP,

 CONSTRAINT fk_produtos_categoria
  FOREIGN KEY(categoria_id)
  REFERENCES tb_categoria(id),
 
 CONSTRAINT fk_produtos_unidade_medida
  FOREIGN KEY(unidade_medida_id)
  REFERENCES tb_unidade_medida(id)
);