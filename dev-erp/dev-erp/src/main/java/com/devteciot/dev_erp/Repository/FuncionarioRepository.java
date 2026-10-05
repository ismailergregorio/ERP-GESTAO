package com.devteciot.dev_erp.Repository;
import com.devteciot.dev_erp.Models.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FuncionarioRepository extends JpaRepository<Funcionario,Long> {
 List<Funcionario> findByAtivoTrueOrderByNomeAsc();
 boolean existsByNomeIgnoreCase(String nome);
}
