package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.SaidaProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SaidaProdutoRepository extends JpaRepository<SaidaProduto, Long> {

    List<SaidaProduto> findBySaidaId(Long saidaId);

    void deleteAllBySaidaId(Long saidaId);

    @Query("select sp from SaidaProduto sp join fetch sp.saida s join fetch sp.produto p " +
           "where p.id = :produtoId order by s.dataCriacao asc")
    List<SaidaProduto> findByProdutoIdOrderBySaidaDataCriacaoAsc(@Param("produtoId") Long produtoId);
}
