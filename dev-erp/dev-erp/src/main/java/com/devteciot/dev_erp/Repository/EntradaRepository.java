package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EntradaRepository extends JpaRepository<Entrada, Long> {

 List<Entrada> findByAtivoTrueOrderByDataCriacaoDesc();

 List<Entrada> findByIdAndAtivoTrue(Long id);

 List<Entrada> findByTipoEntradaIdAndAtivoTrue(Long tipoEntradaId);

 List<Entrada> findByNfIdAndAtivoTrue(Long nfId);
}
