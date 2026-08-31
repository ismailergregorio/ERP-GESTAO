package com.devteciot.API_erp.Services.ServicesNF;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devteciot.API_erp.Models.ModelNf.ModelNF;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutosNf;
import com.devteciot.API_erp.Repository.RepositoryNF;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceNF {

 private final RepositoryNF repositoryNF;

 /*
  * =====================================================
  * SALVAR
  * =====================================================
  */

 @Transactional
 public ModelNF salvar(ModelNF nf) {

  if (nf == null) {
   throw new IllegalArgumentException(
     "A nota fiscal não pode ser nula.");
  }

  if (nf.getNNF() == null) {
   throw new IllegalArgumentException(
     "O número da NF é obrigatório.");
  }

  /*
   * Verifica se já existe uma NF com o mesmo número.
   */
  if (repositoryNF.existsByNNF(nf.getNNF())) {
   throw new IllegalArgumentException(
     "Já existe uma NF cadastrada com o número: "
       + nf.getNNF());
  }

  LocalDateTime agora = LocalDateTime.now();

  nf.setDataCriacao(agora);
  nf.setDataAtualizacao(agora);

  /*
   * Vincula todos os produtos à NF.
   */
  if (nf.getProdutos() != null) {

   for (ModelTbProdutosNf produto : nf.getProdutos()) {

    if (produto == null) {
     continue;
    }

    produto.setNf(nf);
   }
  }

  return repositoryNF.save(nf);
 }

 /*
  * =====================================================
  * SALVAR COM LISTA DE PRODUTOS
  * =====================================================
  */

 @Transactional
 public ModelNF salvar(
   Integer nNF,
   List<ModelTbProdutosNf> produtos) {

  if (nNF == null) {
   throw new IllegalArgumentException(
     "O número da NF é obrigatório.");
  }

  if (repositoryNF.existsByNNF(nNF)) {
   throw new IllegalArgumentException(
     "Já existe uma NF cadastrada com o número: "
       + nNF);
  }

  ModelNF nf = new ModelNF();

  nf.setNNF(nNF);
  nf.setProdutos(produtos);

  LocalDateTime agora = LocalDateTime.now();

  nf.setDataCriacao(agora);
  nf.setDataAtualizacao(agora);

  /*
   * Cria o relacionamento dos dois lados.
   */
  if (produtos != null) {

   for (ModelTbProdutosNf produto : produtos) {

    if (produto == null) {
     continue;
    }

    produto.setNf(nf);
   }
  }

  return repositoryNF.save(nf);
 }

 /*
  * =====================================================
  * BUSCAR POR ID
  * =====================================================
  */

 @Transactional(readOnly = true)
 public ModelNF buscarPorId(Long id) {

  return repositoryNF.findById(id)
    .orElseThrow(() -> new RuntimeException(
      "NF não encontrada: " + id));
 }

 /*
  * =====================================================
  * BUSCAR POR NÚMERO DA NF
  * =====================================================
  */

 @Transactional(readOnly = true)
 public ModelNF buscarPorNumero(Integer nNF) {

  return repositoryNF.findByNNF(nNF)
    .orElseThrow(() -> new RuntimeException(
      "NF não encontrada: " + nNF));
 }

 /*
  * =====================================================
  * LISTAR TODAS
  * =====================================================
  */

 @Transactional(readOnly = true)
 public List<ModelNF> listar() {

  return repositoryNF.findAll();
 }

 /*
  * =====================================================
  * ATUALIZAR
  * =====================================================
  */

 @Transactional
 public ModelNF atualizar(
   Long id,
   ModelNF nfAtualizada) {

  ModelNF nf = repositoryNF.findById(id)
    .orElseThrow(() -> new RuntimeException(
      "NF não encontrada: " + id));

  /*
   * Atualiza número da NF.
   */
  if (nfAtualizada.getNNF() != null) {

   /*
    * Evita duplicidade.
    */
   if (!nf.getNNF().equals(
     nfAtualizada.getNNF())
     &&
     repositoryNF.existsByNNF(
       nfAtualizada.getNNF())) {
    throw new IllegalArgumentException(
      "Já existe uma NF cadastrada com o número: "
        + nfAtualizada.getNNF());
   }

   nf.setNNF(nfAtualizada.getNNF());
  }

  /*
   * Atualiza produtos.
   */
  if (nfAtualizada.getProdutos() != null) {

   nf.getProdutos().clear();

   for (ModelTbProdutosNf produto : nfAtualizada.getProdutos()) {

    if (produto == null) {
     continue;
    }

    produto.setNf(nf);

    nf.getProdutos().add(produto);
   }
  }

  nf.setDataAtualizacao(
    LocalDateTime.now());

  return repositoryNF.save(nf);
 }

 /*
  * =====================================================
  * DELETAR
  * =====================================================
  */

 @Transactional
 public void deletar(Long id) {

  ModelNF nf = repositoryNF.findById(id)
    .orElseThrow(() -> new RuntimeException(
      "NF não encontrada: " + id));

  repositoryNF.delete(nf);
 }
}