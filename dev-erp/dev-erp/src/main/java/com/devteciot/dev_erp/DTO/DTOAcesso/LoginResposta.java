package com.devteciot.dev_erp.DTO.DTOAcesso;

public record LoginResposta(String token, String tipo, long expiraEmSegundos,
                            boolean trocarSenha, UsuarioResposta usuario) {}
