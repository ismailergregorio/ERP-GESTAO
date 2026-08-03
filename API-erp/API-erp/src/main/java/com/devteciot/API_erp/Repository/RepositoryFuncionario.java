package com.devteciot.API_erp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelTbFuncionario;

public interface RepositoryFuncionario extends JpaRepository<ModelTbFuncionario, Long> {

}