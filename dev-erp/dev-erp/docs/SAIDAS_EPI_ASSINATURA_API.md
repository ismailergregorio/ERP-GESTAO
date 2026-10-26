# Documentação — Saídas de EPI/Uniforme, assinatura e PDF

## Resumo

A saída convencional continua disponível em `POST /api/saidas`. Foi adicionada uma saída especializada em EPI/uniforme, que exige a assinatura do funcionário e só aceita produtos cuja categoria seja `EPI` ou `Uniforme` (comparação sem diferenciar maiúsculas/minúsculas). A assinatura é recebida como imagem Base64 (PNG ou JPEG), armazenada no PostgreSQL e incorporada ao PDF.

A migration Flyway `V15__saidas_epi_assinatura_e_categorias.sql` cria as colunas necessárias e insere as categorias padrão `EPI` e `Uniforme`, sem duplicar categorias existentes.

## 1. Criar saída especializada de EPI/uniforme

**POST** `/api/saidas/epi`

`Content-Type: application/json`

Exemplo de corpo:

```json
{
  "funcionarioId": 3,
  "setorId": 1,
  "tipoSaidaId": 2,
  "finalidade": "Entrega de EPI para atividade operacional",
  "obs": "CA conferido no momento da entrega",
  "produtos": [
    { "produtoId": 15, "quantidade": 1 },
    { "produtoId": 18, "quantidade": 2 }
  ],
  "assinaturaBase64": "data:image/png;base64,iVBORw0KGgo..."
}
```

- `funcionarioId`: funcionário que recebe os itens.
- `setorId` e `tipoSaidaId`: cadastros já existentes na API.
- `produtos`: um ou mais produtos; não repetir o mesmo `produtoId` no mesmo pedido.
- `assinaturaBase64`: assinatura desenhada na tela e convertida para Base64. Pode ser enviada como data URL (`data:image/png;base64,...`) ou somente a parte Base64.
- A imagem precisa ser PNG/JPEG válida, com até 2 MB e dimensões máximas de 4000 × 4000.
- Todos os produtos precisam estar ativos, ter estoque disponível e pertencer à categoria `EPI` ou `Uniforme`.
- A operação registra a saída no estoque e a assinatura na mesma transação. Se houver validação inválida, a operação é cancelada.

Resposta: `201 Created`, com os dados da saída, `saidaEpi: true`, `assinaturaColetada: true` e `dataAssinatura`.

## 2. Registrar/atualizar assinatura de uma saída existente

**POST** `/api/saidas/{id}/assinatura`

```json
{
  "assinaturaBase64": "data:image/png;base64,iVBORw0KGgo..."
}
```

Retorna `200 OK` com a saída atualizada. A assinatura mais recente substitui a anterior e atualiza `dataAssinatura`. Essa rota é útil para coletar assinatura posteriormente; para saída especializada, prefira enviar a assinatura junto com a criação em `/epi`.

## 3. Gerar PDF da saída

**GET** `/api/saidas/{id}/pdf`

Retorna `application/pdf`, com `Content-Disposition: inline; filename=saida-{id}.pdf`. O documento inclui o número da saída, data, funcionário destinatário, setor, tipo, finalidade, observações, itens, quantidades e valores, além da imagem de assinatura e horário em que foi registrada quando disponível.

Saídas desativadas não geram PDF.

## 4. Rotas existentes preservadas

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/saidas` | Criar saída convencional, sem obrigatoriedade de assinatura. |
| `GET` | `/api/saidas` | Listar saídas ativas. |
| `GET` | `/api/saidas/{id}` | Consultar saída. |
| `PUT` | `/api/saidas/{id}` | Atualizar saída convencional. Saídas EPI/uniforme são bloqueadas nesta rota para preservar o registro assinado. |
| `DELETE` | `/api/saidas/{id}` | Desativar saída e devolver os itens ao estoque, conforme regra existente. |

A resposta das saídas inclui os campos adicionais:

- `saidaEpi`: indica se é uma saída especializada.
- `assinaturaColetada`: informa se há imagem de assinatura salva, sem retornar a imagem em Base64.
- `dataAssinatura`: data/hora da assinatura ou `null`.

## 5. Categorias padrão

A migration cria as categorias `EPI` e `Uniforme` caso ainda não existam. Para usar a saída especializada, cadastre/edite os produtos e vincule-os a uma dessas categorias. As categorias não são atribuídas automaticamente a produtos existentes, pois isso poderia classificar itens incorretamente.

## 6. Implementação da assinatura no frontend

Em uma tela com `<canvas>` ou componente de assinatura, converta o desenho em PNG, por exemplo com `canvas.toDataURL("image/png")`, e envie o resultado no campo `assinaturaBase64`. Não envie uma URL temporária do navegador; envie o conteúdo Base64.

## 7. Arquivos incluídos neste pacote

O ZIP contém somente os arquivos modificados/criados para esta funcionalidade: controller, serviço de saída, serviço PDF, entidade e DTOs/mapeador de saída, migration Flyway, dependência PDFBox no `pom.xml` e esta documentação.
