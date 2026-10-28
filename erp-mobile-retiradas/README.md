# ERP Mobile — Retiradas

Aplicativo Expo / React Native para registrar saídas comuns e entregas de EPI/uniformes com assinatura. O código é modularizado e todas as requisições HTTP usam a instância central do **Axios**.

## Requisitos
- Node.js LTS
- API ERP em execução e acessível pelo dispositivo móvel

## Configurar o endereço da API
Copie `.env.example` para `.env` e ajuste `EXPO_PUBLIC_API_URL`:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.20:8080/api
```

Substitua o IP pelo endereço IPv4 do computador que executa o backend. Não use `localhost` em um celular físico, pois ele apontaria para o próprio aparelho. O celular e o computador devem estar na mesma rede quando a API for local. Para Android Emulator, normalmente use `http://10.0.2.2:8080/api`.

A URL base segue a configuração do site ERP enviado (`http://localhost:8080/api` + rotas como `/funcionarios`). Se o backend usar outro contexto, ajuste somente `EXPO_PUBLIC_API_URL`.

Depois de mudar `.env`, reinicie o Expo para carregar a variável:

```bash
npx expo start --clear
```

## Executar
```bash
npm install
npx expo start
```

## Organização das requisições Axios
- `src/api.ts`: instância Axios, timeout e tratamento centralizado de erros.
- `src/services/funcionarioService.ts`: listar e cadastrar funcionários.
- `src/services/produtoService.ts`: listar produtos ativos.
- `src/services/setorService.ts`: listar setores.
- `src/services/tipoSaidaService.ts`: listar tipos de saída.
- `src/services/saidaService.ts`: listar saídas e registrar saída comum ou EPI.

## Rotas utilizadas
- `GET /funcionarios`
- `POST /funcionarios`
- `GET /produtos/ativos`
- `GET /setores`
- `GET /tipos-saidas`
- `POST /saidas`
- `POST /saidas/epi`

Todas as chamadas são feitas via `api.get`, `api.post` da instância Axios, retornando `response.data`. Os erros de conexão, timeout e respostas HTTP são tratados com `mensagemErroApi`.

## Observações
1. O cadastro rápido envia `POST /funcionarios` com `{ nome, cpf? }`, seguindo o tipo `FuncionarioRequest` do site ERP.
2. A saída comum envia `assinaturaBase64` quando a pessoa assina. O tipo do backend aceita esse campo como opcional conforme o contrato do site; confirme que a API persiste a assinatura no endpoint comum.
3. A saída de EPI/uniforme envia `assinaturaBase64` obrigatoriamente para `POST /saidas/epi`.
4. A classificação de categorias usa os nomes `EPI` e `Uniforme`, como no site.
5. O app precisa de conectividade com a API; não implementa fila offline.
6. Se a API exigir autenticação, o token/header correspondente precisa ser configurado na instância `src/api.ts`.


## Assinatura
- Saída comum: assinatura opcional. Se não for coletada, `assinaturaBase64` é omitida do payload.
- Saída de EPI/uniforme: assinatura obrigatória, validada antes de enviar `POST /saidas/epi`.
- Expo Web: usa `react-signature-canvas` no navegador, evitando o erro `React Native WebView does not support this platform`.
- Android/iOS: mantém o componente nativo `react-native-signature-canvas`.


## Limpeza automática após retirada
Após a API confirmar o sucesso de `POST /saidas` ou `POST /saidas/epi`, o formulário limpa usuário, setor, tipo de saída, finalidade, observações, produtos, quantidades, pesquisa e assinatura. O tipo de retirada selecionado é preservado para agilizar a próxima operação. Em caso de falha na API, os dados permanecem preenchidos para correção e nova tentativa.
