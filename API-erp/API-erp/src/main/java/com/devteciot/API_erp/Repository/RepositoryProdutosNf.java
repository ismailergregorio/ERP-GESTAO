package com.devteciot.API_erp.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelNf.ModelNF;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutosNf;

public interface RepositoryProdutosNf extends JpaRepository<ModelTbProdutosNf, Long> {
 List<ModelTbProdutosNf> findByNf(ModelNF nf);

 List<ModelTbProdutosNf> findByNfId(Long nfId);
}
