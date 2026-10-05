package com.devteciot.dev_erp.Repository;
import com.devteciot.dev_erp.Models.TipoSaida;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TipoSaidaRepository extends JpaRepository<TipoSaida,Long> {
 List<TipoSaida> findByAtivoTrueOrderByNomeAsc();
 boolean existsByNomeIgnoreCase(String nome);
}
