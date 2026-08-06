package com.devteciot.API_erp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelTbFuncionario;

public interface RepositoryFuncionario extends JpaRepository<ModelTbFuncionario, Long> {
 Optional<ModelTbFuncionario> findByCpf(String cpf);

 Optional<ModelTbFuncionario> findByNome(String nome);
}