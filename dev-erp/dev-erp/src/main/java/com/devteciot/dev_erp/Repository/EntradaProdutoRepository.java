package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.EntradaProduto;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EntradaProdutoRepository
  extends JpaRepository<EntradaProduto, Long> {

 /*
  * =====================================================
  * LISTAR PRODUTOS DE UMA ENTRADA
  * =====================================================
  */

 List<EntradaProduto> findByEntradaId(
   Long entradaId);

 /*
  * =====================================================
  * LISTAR ENTRADAS DE UM PRODUTO
  * =====================================================
  */

 List<EntradaProduto> findByProdutoId(
   Long produtoId);

 /*
  * =====================================================
  * LISTAR PELO PRODUTO DA NF
  * =====================================================
  */

 List<EntradaProduto> findByProdutoNFId(
   Long produtoNFId);
}