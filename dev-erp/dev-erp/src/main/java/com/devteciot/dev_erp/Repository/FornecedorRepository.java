package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.Fornecedor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FornecedorRepository
  extends JpaRepository<Fornecedor, Long> {

 List<Fornecedor> findByAtivoTrue();

 boolean existsByCnpj(String cnpj);

 Optional<Fornecedor> findByCnpj(String cnpj);
}