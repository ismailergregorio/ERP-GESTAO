package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.Produto;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByAtivoTrue();
    boolean existsByNomeIgnoreCase(String nome);
    boolean existsByCategoriaId(Long categoriaId);
    boolean existsByUnidadeMedidaId(Long unidadeMedidaId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Produto p where p.id = :id")
    Optional<Produto> findByIdForUpdate(@Param("id") Long id);
}
