CREATE TABLE tb_funcionario(
 id BIGSERIAL PRIMARY KEY,
 nome VARCHAR(150) NOT NULL UNIQUE,
 cpf VARCHAR(50) NOT NULL,
 centro_custo_id BIGINT NOT NULL,
 data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 data_atualizacao TIMESTAMP,

 CONSTRAINT fk_funcionario_cento_custo
  FOREIGN KEY (centro_custo_id)
  REFERENCES tb_centro_custo(id)
);