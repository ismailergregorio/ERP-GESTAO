# Controle de acesso — atualização de perfil e redefinição de senha

Esta atualização parte do projeto ERP enviado (`dev-erp(3).zip`). Ela adiciona a edição do nome pelo próprio usuário e a redefinição de senha por um administrador, sem recriar a aplicação nem alterar as migrations existentes.

## Regras de autorização

- Qualquer usuário autenticado pode alterar **somente o próprio nome**.
- Qualquer usuário autenticado pode alterar **somente a própria senha**, informando a senha atual.
- Somente um usuário com perfil `ADMIN` pode redefinir a senha de outra conta.
- O administrador não pode usar a rota de redefinição para alterar a própria senha; para isso, deve usar a rota de alteração pessoal.
- Ao redefinir a senha de outra conta, a API marca `trocarSenha=true`. O usuário precisará definir uma nova senha no próximo acesso antes de usar os demais endpoints.
- A nova senha definida pelo próprio usuário e a senha temporária de redefinição devem ter entre 12 e 72 caracteres.
- O nome é obrigatório e aceita até 120 caracteres.
- As senhas são armazenadas com BCrypt; a API nunca retorna o hash.

## Arquivos alterados

1. `src/main/java/com/devteciot/dev_erp/Controller/AuthController.java`
   - Adicionado `PATCH /api/auth/me/nome`.
2. `src/main/java/com/devteciot/dev_erp/Controller/UsuarioAcessoController.java`
   - Adicionado `POST /api/usuarios/{id}/resetar-senha`.
3. `src/main/java/com/devteciot/dev_erp/Service/UsuarioAcessoService.java`
   - Adicionada a atualização do nome da conta autenticada.
   - Adicionada a redefinição de senha com verificação do perfil ADMIN e bloqueio de redefinição da própria conta.
4. `src/main/java/com/devteciot/dev_erp/Configuration/SecurityConfig.java`
   - Liberada a rota de alteração do próprio nome para qualquer conta autenticada, respeitando o bloqueio de primeiro acesso.
5. `src/main/java/com/devteciot/dev_erp/DTO/DTOAcesso/AlterarSenhaRequest.java`
   - Aumentado o mínimo da nova senha de 6 para 12 caracteres.

## Arquivos criados

- `src/main/java/com/devteciot/dev_erp/DTO/DTOAcesso/AtualizarNomeRequest.java`
- `src/main/java/com/devteciot/dev_erp/DTO/DTOAcesso/ResetarSenhaRequest.java`

## 1. Alterar o próprio nome

`PATCH /api/auth/me/nome`

Requer token JWT no cabeçalho `Authorization: Bearer <token>`.

Requisição:

```http
PATCH /api/auth/me/nome
Authorization: Bearer SEU_TOKEN
Content-Type: application/json
```

```json
{
  "nome": "Nome Atualizado"
}
```

Resposta `200 OK` (exemplo):

```json
{
  "id": 2,
  "nome": "Nome Atualizado",
  "nomeUsuario": "estoquista01",
  "perfil": "ESTOQUISTA",
  "ativo": true,
  "trocarSenha": false,
  "dataCriacao": "2026-10-27T10:00:00"
}
```

O endpoint não recebe ID de usuário: a conta alterada é obtida a partir do token autenticado. Dessa forma, não é possível escolher o nome de outra conta por essa rota.

## 2. Alterar a própria senha

`POST /api/auth/alterar-senha`

Requer token JWT e senha atual correta.

```http
POST /api/auth/alterar-senha
Authorization: Bearer SEU_TOKEN
Content-Type: application/json
```

```json
{
  "senhaAtual": "SenhaAtualForte#2026",
  "novaSenha": "MinhaNovaSenhaForte#2026"
}
```

Sucesso: `204 No Content`.

Possíveis erros:
- `400 Bad Request`: senha atual incorreta ou nova senha igual à atual.
- `400 Bad Request`: nova senha não respeita o tamanho de 12 a 72 caracteres.
- `401 Unauthorized`: token ausente, inválido ou conta inativa.

A conta que precisa trocar senha temporária pode utilizar esta rota com a senha temporária recebida.

## 3. ADMIN redefinir a senha de outro usuário

`POST /api/usuarios/{id}/resetar-senha`

Requer token JWT de um usuário com perfil `ADMIN`. O ID na URL é o ID da conta cuja senha será redefinida.

```http
POST /api/usuarios/5/resetar-senha
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json
```

```json
{
  "senhaTemporaria": "NovaSenhaTemporaria#2026"
}
```

Sucesso: `204 No Content`.

A API salva o hash da senha temporária e marca `trocarSenha=true`. Na próxima autenticação, a pessoa deverá alterar a senha antes de acessar os demais recursos.

Possíveis erros:
- `400 Bad Request`: o administrador tentou redefinir a própria senha.
- `400 Bad Request`: senha temporária fora do tamanho permitido.
- `401 Unauthorized`: token inválido ou ausente.
- `403 Forbidden`: usuário autenticado sem perfil ADMIN.
- `404 Not Found`: conta de destino não existe.

A redefinição não muda o nome, nome de usuário, perfil ou estado ativo da conta.

## 4. Comportamento de primeiro acesso

Quando `trocarSenha=true`, o filtro JWT permite apenas os endpoints de consulta do próprio usuário (`GET /api/auth/me`) e alteração de senha (`POST /api/auth/alterar-senha`). Depois que a senha é alterada com sucesso, `trocarSenha` passa a `false` e os acessos autorizados pelo perfil voltam a funcionar.

## 5. Teste manual sugerido

1. Faça login em `POST /api/auth/login` e copie o token.
2. Teste `PATCH /api/auth/me/nome` com o token de um usuário comum.
3. Teste `POST /api/auth/alterar-senha` com a senha atual e uma nova senha de pelo menos 12 caracteres.
4. Faça login como ADMIN e chame `POST /api/usuarios/{id}/resetar-senha` usando o ID de outro usuário.
5. Faça login com a senha temporária dessa conta e confirme que a API exige a alteração da senha.
6. Tente a redefinição com um token de `ESTOQUISTA` ou `CONSULTA`; deve receber `403 Forbidden`.
7. Tente redefinir a senha do próprio ADMIN; deve receber `400 Bad Request`.

## Aplicação

Copie os arquivos do pacote para os mesmos caminhos do projeto. Não há nova migration: a atualização utiliza a tabela `usuarios_acesso` e o campo `trocar_senha` já existente.

A compilação Maven e os testes de integração não foram executados neste ambiente. Execute localmente antes de publicar:

```bash
./mvnw test
```

No Windows:

```powershell
.\mvnw.cmd test
```
