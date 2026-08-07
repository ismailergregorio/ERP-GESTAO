package com.devteciot.API_erp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelSaida.ModelTbSaida;
import java.util.List;

public interface RepositorySaida extends JpaRepository<ModelTbSaida, Long> {
 // Optional<ModelTbSaida> findByFuncionario_idId(Long funcionarioId);
 List<ModelTbSaida> findByFuncionario(Long funcionario);
}