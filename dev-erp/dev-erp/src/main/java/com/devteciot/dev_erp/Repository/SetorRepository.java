package com.devteciot.dev_erp.Repository;
import com.devteciot.dev_erp.Models.Setor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SetorRepository extends JpaRepository<Setor,Long> {
 List<Setor> findByAtivoTrueOrderByNomeAsc();
 boolean existsByNomeIgnoreCase(String nome);
}
