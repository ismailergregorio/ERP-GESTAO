package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.TipoEntrada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoEntradaRepository extends JpaRepository<TipoEntrada, Long> {

 Optional<TipoEntrada> findByNomeIgnoreCase(String nome);

 boolean existsByNomeIgnoreCase(String nome);
}