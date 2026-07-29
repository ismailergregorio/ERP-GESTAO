# ERP-GESTAO
# Documento de Requisitos – Sistema ERP de Controle de Estoque

# 1. Visão Geral

## Nome do Projeto

**ERP de Controle de Estoque e Almoxarifado**

## Objetivo

Desenvolver um sistema ERP para gerenciamento completo de almoxarifado, permitindo controlar a entrada, saída e movimentação de materiais, controlar níveis de estoque, gerenciar compras, fornecedores, funcionários, setores e solicitações de retirada de itens.

O sistema deverá possuir uma interface moderna, intuitiva e responsiva, utilizando como identidade visual as cores **azul e branco**, proporcionando facilidade de utilização para todos os usuários.

---

# 2. Objetivos do Sistema

O sistema deverá permitir:

* Controlar todo o estoque da empresa.
* Registrar entradas e saídas de materiais.
* Controlar saldo disponível.
* Registrar histórico completo das movimentações.
* Automatizar solicitações de compra.
* Gerenciar fornecedores.
* Gerenciar funcionários e setores.
* Permitir solicitações de retirada de materiais.
* Emitir diversos relatórios gerenciais.
* Possuir níveis de acesso por usuário.

---

# 3. Tecnologias Previstas

## Front-end

* React
* TypeScript
* Vite
* CSS / SASS

## Back-end

* Java
* Spring Boot

## Banco de Dados

* PostgreSQL

## Segurança

* JWT
* Spring Security

## Comunicação

* API REST

---

# 4. Identidade Visual

## Cores

### Primárias

```css
#041c32
#093448
#0a4761
#0e4b6b
#166b99
```

### Fundo

```css
#000000
```

### Textos

```css
#E4E4E4
#BFBFBF
#A3A3A3
```

### Verde

Utilizado para:

* Aprovação
* Entrada
* Sucesso
* Estoque disponível

### Vermelho

Utilizado para:

* Exclusão
* Estoque baixo
* Cancelamentos
* Erros

---

# 5. Módulos do Sistema

## Dashboard

Será a tela inicial do sistema.

Deverá apresentar:

* Quantidade total de produtos
* Valor total em estoque
* Produtos com estoque baixo
* Produtos sem estoque
* Compras pendentes
* Entradas do mês
* Saídas do mês
* Produtos mais movimentados
* Gráficos
* Últimas movimentações
* Avisos importantes

---

# 6. Módulo de Estoque

## Cadastro de Produtos

Cada produto deverá possuir:

* Código
* Código de barras
* Nome
* Descrição
* Categoria
* Unidade
* Marca
* Modelo
* Estoque mínimo
* Estoque máximo
* Quantidade atual
* Localização física
* Valor unitário
* Data de cadastro
* Status

---

## Entrada de Produtos

Cada entrada deverá registrar:

* Número da entrada
* Produto
* Quantidade
* Valor unitário
* Valor total
* Fornecedor
* Nota Fiscal
* Data
* Funcionário responsável
* Observações

Após a entrada, o estoque deverá ser atualizado automaticamente.

---

## Saída de Produtos

Cada saída deverá registrar:

* Produto
* Quantidade
* Funcionário
* Setor
* Finalidade
* Data
* Responsável
* Observações

Após a saída, o estoque deverá ser atualizado automaticamente.

---

## Controle de Estoque

O sistema deverá permitir:

* Consultar saldo em tempo real.
* Consultar histórico.
* Consultar movimentações.
* Consultar localização do item.
* Visualizar estoque mínimo.
* Visualizar estoque máximo.
* Visualizar estoque crítico.

---

# 7. Módulo de Compras

Este módulo será responsável pelo gerenciamento das compras da empresa.

## Funcionalidades

* Solicitação de compra
* Aprovação
* Cotação
* Comparação de fornecedores
* Emissão do pedido de compra
* Recebimento dos materiais
* Histórico de compras

Cada compra deverá possuir:

* Número
* Data
* Solicitante
* Setor
* Produtos
* Quantidades
* Valor total
* Fornecedor
* Status

Status possíveis:

* Em análise
* Aprovada
* Comprada
* Recebida
* Cancelada

---

# 8. Cadastro de Fornecedores

Informações:

* Razão Social
* Nome Fantasia
* CNPJ
* Inscrição Estadual
* Endereço
* Cidade
* Estado
* CEP
* E-mail
* Telefone
* Contato
* Categoria
* Status

---

# 9. Cadastro de Funcionários

Informações:

* Nome
* CPF
* Matrícula
* Cargo
* Setor
* Telefone
* E-mail
* Usuário
* Senha
* Permissão
* Status

---

# 10. Cadastro de Setores

Cada setor deverá possuir:

* Código
* Nome
* Responsável
* Centro de custo
* Descrição

Exemplos:

* Administrativo
* Produção
* Compras
* Almoxarifado
* Engenharia
* Manutenção
* Limpeza
* TI

---

# 11. Solicitação de Retirada de Itens

Será uma aplicação destinada aos funcionários.

O funcionário poderá:

* Pesquisar materiais
* Consultar disponibilidade
* Solicitar retirada
* Informar quantidade
* Informar finalidade
* Informar observações

Fluxo:

Funcionário → Solicitação → Aprovação → Separação → Retirada → Histórico

Cada solicitação deverá possuir:

* Número
* Funcionário
* Setor
* Produto
* Quantidade
* Data
* Status
* Responsável pela aprovação

---

# 12. Relatórios

O sistema deverá possuir diversos relatórios.

## Estoque

* Estoque atual
* Estoque mínimo
* Estoque máximo
* Produtos sem movimentação
* Produtos críticos

## Compras

* Compras por período
* Compras por fornecedor
* Produtos mais comprados
* Gastos por setor

## Funcionários

* Retiradas por funcionário
* Retiradas por setor
* Histórico completo

## Produtos

* Produtos mais utilizados
* Produtos mais retirados
* Produtos mais comprados

## Financeiro

* Valor total em estoque
* Valor de compras
* Valor consumido
* Valor por setor

Todos os relatórios deverão possuir exportação em:

* PDF
* Excel

---

# 13. Controle de Usuários

O sistema deverá possuir autenticação utilizando JWT.

Perfis:

## Administrador

* Acesso total.

## Compras

* Gerenciar compras.
* Gerenciar fornecedores.

## Almoxarife

* Entrada de produtos.
* Saída de produtos.
* Controle de estoque.

## Gestor

* Aprovar solicitações.
* Consultar relatórios.

## Funcionário

* Solicitar retirada.
* Consultar suas solicitações.

---

# 14. Regras de Negócio

* Não permitir estoque negativo.
* Toda movimentação deverá possuir histórico.
* Toda retirada deverá possuir responsável.
* Compras deverão possuir fornecedor.
* Produtos inativos não poderão ser movimentados.
* Exclusões físicas não serão permitidas; utilizar exclusão lógica.
* Todas as operações deverão registrar data, hora e usuário responsável (auditoria).

---

# 15. Dashboard Principal

O painel inicial deverá apresentar:

* Total de produtos cadastrados.
* Quantidade em estoque.
* Valor financeiro do estoque.
* Entradas do mês.
* Saídas do mês.
* Compras pendentes.
* Produtos com estoque crítico.
* Produtos próximos do estoque mínimo.
* Gráfico de movimentação diária.
* Gráfico de compras mensais.
* Produtos mais retirados.
* Produtos mais comprados.
* Últimas movimentações.
* Últimas solicitações.
* Últimas compras.
* Alertas do sistema.

---

# 16. Funcionalidades Futuras

* Aplicativo mobile para retirada de materiais.
* Leitura por QR Code.
* Leitura por código de barras.
* Integração com coletores de dados.
* Integração com ERP financeiro.
* Assinatura digital nas retiradas.
* Controle de patrimônio.
* Controle de validade dos produtos.
* Controle de lotes.
* Inventário por coletor.
* Integração com impressoras de etiquetas.
* Integração com Power BI.
* Notificações por e-mail.
* Notificações via WhatsApp.
* Aprovação em múltiplos níveis.
* Controle de orçamento por centro de custo.
* API pública para integração com outros sistemas.

---

# 17. Objetivo Final

Este ERP deverá centralizar toda a gestão do almoxarifado em uma única plataforma, proporcionando maior controle operacional, rastreabilidade das movimentações, redução de perdas, otimização das compras e suporte à tomada de decisões por meio de indicadores e relatórios gerenciais. O sistema deverá ser escalável, seguro, intuitivo e preparado para futuras integrações com aplicações web, mobile e dispositivos de automação.

