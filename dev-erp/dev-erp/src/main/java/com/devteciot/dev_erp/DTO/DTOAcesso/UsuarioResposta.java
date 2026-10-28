package com.devteciot.dev_erp.DTO.DTOAcesso;

import com.devteciot.dev_erp.Models.PerfilAcesso;
import com.devteciot.dev_erp.Models.UsuarioAcesso;
import java.time.LocalDateTime;

public record UsuarioResposta(Long id, String nome, String nomeUsuario, PerfilAcesso perfil,
                              boolean ativo, boolean trocarSenha, LocalDateTime dataCriacao) {
    public static UsuarioResposta de(UsuarioAcesso u) {
        return new UsuarioResposta(u.getId(), u.getNome(), u.getNomeUsuario(), u.getPerfil(),
                Boolean.TRUE.equals(u.getAtivo()), Boolean.TRUE.equals(u.getTrocarSenha()), u.getDataCriacao());
    }
}
