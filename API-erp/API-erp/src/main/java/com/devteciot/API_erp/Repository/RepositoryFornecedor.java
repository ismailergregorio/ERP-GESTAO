package com.devteciot.API_erp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelTbFornecedores;



public interface RepositoryFornecedor extends JpaRepository<ModelTbFornecedores, Long> {
 Optional<ModelTbFornecedores>  findByRazaoSocial(String razaoSocial);

 Optional<ModelTbFornecedores> findByCnpj(String cnpj);
}
