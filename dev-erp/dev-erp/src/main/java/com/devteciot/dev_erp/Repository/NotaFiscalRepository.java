package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.NotaFiscal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotaFiscalRepository
  extends JpaRepository<NotaFiscal, Long> {

 boolean existsByChaveAcesso(String chaveAcesso);

 boolean existsByNumeroAndFornecedorId(
   String numero,
   Long fornecedorId);

 List<NotaFiscal> findByFornecedorId(
   Long fornecedorId);
}
