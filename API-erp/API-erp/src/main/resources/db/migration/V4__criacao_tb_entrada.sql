CREATE TABLE tb_tipo_entrada(
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP
);

CREATE TABLE tb_entrada(
  id BIGSERIAL PRIMARY KEY,
  nota_fiscal INT NOT NULL,
  fornecedor_id BIGINT NOT NULL,
  tipo_entrada_id BIGINT NOT NULL,
  observacao VARCHAR(250) DEFAULT '',
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP,

  CONSTRAINT fk_entrada_fonecedor
    FOREIGN KEY (fornecedor_id)
    REFERENCES tb_fornecedor(id),

  CONSTRAINT fk_entrada_tipo_entrada
    FOREIGN KEY (tipo_entrada_id)
    REFERENCES tb_tipo_entrada(id)
);

CREATE TABLE tb_entrada_produtos(
  id BIGSERIAL PRIMARY KEY,
  entrada_id BIGINT NOT NULL,
  produto_id BIGINT NOT NULL,
  quantidade INT NOT NULL,
  valor_uni NUMERIC(12,2) DEFAULT 0,
  valor_total NUMERIC(12,2) DEFAULT 0,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP,

  CONSTRAINT fk_entrada_produtos_entrada
    FOREIGN KEY (entrada_id)
    REFERENCES tb_entrada(id),
  
  CONSTRAINT fk_entrada_produtos_produto
    FOREIGN KEY (produto_id)
    REFERENCES tb_produtos(id)
);