package com.devteciot.dev_erp.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

 @Bean
 public OpenAPI customOpenAPI() {

  return new OpenAPI()
    .info(new Info()
      .title("ERP - Gestão de Estoque API")
      .version("1.0.0")
      .description(
        "API responsável pelo gerenciamento de produtos, "
          + "estoque, entradas, saídas, fornecedores e movimentações."));
 }
}
