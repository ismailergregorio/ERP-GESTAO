package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.DTOAcesso.*;
import com.devteciot.dev_erp.Models.UsuarioAcesso;
import com.devteciot.dev_erp.Repository.UsuarioAcessoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Locale;

@Service @RequiredArgsConstructor
public class UsuarioAcessoService {
    private final UsuarioAcessoRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResposta login(LoginRequest request) {
        UsuarioAcesso usuario = repository.findByNomeUsuarioIgnoreCase(normalizar(request.getNomeUsuario()))
                .filter(u -> Boolean.TRUE.equals(u.getAtivo()))
                .filter(u -> passwordEncoder.matches(request.getSenha(), u.getSenhaHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos."));
        return new LoginResposta(jwtService.gerar(usuario.getNomeUsuario()), "Bearer", jwtService.getExpirationSeconds(),
                Boolean.TRUE.equals(usuario.getTrocarSenha()), UsuarioResposta.de(usuario));
    }

    public UsuarioResposta atual() { return UsuarioResposta.de(usuarioAutenticado()); }
    public UsuarioAcesso usuarioAutenticado() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado.");
        return repository.findByNomeUsuarioIgnoreCase(auth.getName()).filter(u -> Boolean.TRUE.equals(u.getAtivo()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Conta inativa ou inexistente."));
    }

    @Transactional
    public UsuarioResposta atualizarMeuNome(AtualizarNomeRequest request) {
        UsuarioAcesso usuario = usuarioAutenticado();
        String nome = request.getNome().trim();
        if (nome.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O nome não pode ficar vazio.");
        usuario.setNome(nome);
        return UsuarioResposta.de(repository.save(usuario));
    }

    @Transactional
    public void alterarSenha(AlterarSenhaRequest request) {
        UsuarioAcesso usuario = usuarioAutenticado();
        if (!passwordEncoder.matches(request.getSenhaAtual(), usuario.getSenhaHash()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha atual está incorreta.");
        if (passwordEncoder.matches(request.getNovaSenha(), usuario.getSenhaHash()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A nova senha deve ser diferente da atual.");
        usuario.setSenhaHash(passwordEncoder.encode(request.getNovaSenha()));
        usuario.setTrocarSenha(false);
        repository.save(usuario);
    }

    @Transactional
    public UsuarioResposta criar(UsuarioCriacaoRequest request) {
        String username = normalizar(request.getNomeUsuario());
        if (repository.existsByNomeUsuarioIgnoreCase(username))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nome de usuário já cadastrado.");
        UsuarioAcesso usuario = new UsuarioAcesso();
        usuario.setNome(request.getNome().trim());
        usuario.setNomeUsuario(username);
        usuario.setSenhaHash(passwordEncoder.encode(request.getSenhaTemporaria()));
        usuario.setPerfil(request.getPerfil());
        usuario.setAtivo(true);
        usuario.setTrocarSenha(true);
        return UsuarioResposta.de(repository.save(usuario));
    }

    public List<UsuarioResposta> listar() { return repository.findAll().stream().map(UsuarioResposta::de).toList(); }

    @Transactional
    public void resetarSenha(Long id, ResetarSenhaRequest request) {
        UsuarioAcesso administrador = usuarioAutenticado();
        if (administrador.getPerfil() != com.devteciot.dev_erp.Models.PerfilAcesso.ADMIN)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente ADMIN pode redefinir senhas.");

        if (administrador.getId().equals(id))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Para alterar sua própria senha, utilize /api/auth/alterar-senha.");

        UsuarioAcesso usuario = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        usuario.setSenhaHash(passwordEncoder.encode(request.getSenhaTemporaria()));
        usuario.setTrocarSenha(true);
        repository.save(usuario);
    }

    @Transactional
    public UsuarioResposta alterarStatus(Long id, boolean ativo) {
        UsuarioAcesso u = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        if (!ativo && u.getId().equals(usuarioAutenticado().getId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é permitido desativar a própria conta.");
        u.setAtivo(ativo);
        return UsuarioResposta.de(repository.save(u));
    }

    private String normalizar(String value) { return value.trim().toLowerCase(Locale.ROOT); }
}
