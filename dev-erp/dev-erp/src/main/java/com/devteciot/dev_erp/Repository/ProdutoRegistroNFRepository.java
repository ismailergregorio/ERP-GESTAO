package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.ProdutoRegistroNF;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRegistroNFRepository
  extends JpaRepository<ProdutoRegistroNF, Long> {

 List<ProdutoRegistroNF> findByNfId(
   Long nfId);

 List<ProdutoRegistroNF> findByAtivoTrue();

 List<ProdutoRegistroNF> findByNfIdAndAtivoTrue(
   Long nfId);
}