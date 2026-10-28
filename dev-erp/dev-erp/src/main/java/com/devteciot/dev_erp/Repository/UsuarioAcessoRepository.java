package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.UsuarioAcesso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioAcessoRepository extends JpaRepository<UsuarioAcesso, Long> {
    Optional<UsuarioAcesso> findByNomeUsuarioIgnoreCase(String nomeUsuario);
    boolean existsByNomeUsuarioIgnoreCase(String nomeUsuario);
}
