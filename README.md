# Projeto de Testes Automáticos | Cypress helpdesk-api-tests

Neste projeto eu utilizei o **Cypress** para automatizar os testes de API de uma aplicação de suporte técnico (Helpdesk).

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Clone do repositório para o ambiente local](#clone-do-repositorio-para-o-ambiente-local)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração de geração de Relatório dos Testes](#configuração-de-geração-de-relatório-dos-testes)
- [Rodando os Testes localmente](#rodando-os-testes-localmente)
- [Rodando os Testes na Pipeline do Github](#rodando-os-testes-na-pipeline-do-github)
- [Acessando o Relatório de Testes gerado](#acessando-o-relatório-de-testes-gerado)
- [Alguns pontos de melhoria](#alguns-pontos-de-melhoria) 

# Tecnologias Utilizadas
  - **Cypress**
  - **Node.js**
  - **Faker**
  - **Mochawesome**

## Pré-requisitos

Antes de começar, é necessário ter o **Node.js** instalado.

1. Instale o [Node.js](https://nodejs.org/)

## Clone do repositório para o ambiente local

1. Clone este repositório para sua máquina local

   ```bash
   git clone https://github.com/raianeviegass/helpdesk-api-tests
   cd helpdesk-api-tests
   ```
2. Instale as dependências utilizando o seguinte comando pelo terminal:
   ```bash
   npm install
   ```

## Estrutura do Projeto

```bash
/cypress
    /e2e
        /api-tests
            users.cy.js
            tickets.cy.js
    /fixtures
    /support
        /utils
        commands.js
        e2e.js
    /node_modules
```
## Configuração de geração de Relatório dos Testes

Foi adicionado a este projeto uma geração automática de relatórios dos testes usando **Mochawesome**, e ele é gerado no final de toda a execução.
Esta configuração é feita no arquivo `cypress.config.js`, conforme exemplo abaixo:

```javascript
{
  "reporter": "mochawesome",
  "reporterOptions": {
    "reportDir": "./reports",
    "reportFilename": "relatorio-final-testes",
    "overwrite": true,
    "html": true,
    "json": true
  }
}
```

## Rodando os Testes localmente

Você pode rodar os testes de duas formas:

1. **Modo Interativo** (com a interface gráfica do Cypress):  
   ```bash
   npx cypress open
   ```
2. **Modo Headless** (sem interface gráfica):  
   ```bash
   npm run test
   ```

## Rodando os Testes na Pipeline do Github

Foi criado o arquivo `cypress.yml` para configuração da pipeline de execução automática dos testes desse projeto no Github Actions.
Abaixo você verá a configuração básica padrão que dispara a execução deles na nuvem a cada push que é realizado no projeto:

```yml
  name: Cypress Tests

  on:
    push:
      branches:
        - main
    pull_request:
      branches:
        - main

  jobs:
    cypress:
      runs-on: ubuntu-latest
      steps:
        - name: Check out tests repository
          uses: actions/checkout@v2

        - name: Clone application repository
          run: git clone https://github.com/automacaohml/helpdesk-api.git
```

## Acessando o Relatório de Testes gerado

  **Pré-condição para o modo Pipeline**: Para obter acesso ao link do relatório de teste gerado na sessão de "Artifacts" do workflow no Github Actions, é necessário que esteja autenticado/logado no GitHub.

 **Modo local**:  
   1. Rode os testes localmente conforme orientações na sessão - [Rodando os Testes localmente](#rodando-os-testes-localmente)   
   2. Após a execução dos testes, um repositório nomeado como `reports` será gerado
   3. Acesse esse diretório e clique com botão direito do mouse no arquivo `relatorio-final-testes.html`
   4. Selecione a opção de `Reveal in File Explorer`
   5. Dê um duplo clique no arquivo `relatorio-final-testes.html` para que ele seja aberto pelo navegador padrão do seu computador

      **Observação 1**: Caso o seu navegador seja o Gooogle Chrome e ele esteja com problemas para visualizar o relatório (talvez exibindo uma tela toda branca), tente abrir o arquivo utilizando outros navegadores, por exemplo Firefox ou Edge.

      **Observação 2**: Se mesmo ao tentar utilizar outros navegadores o arquivo esteja sendo exibido em branco, por favor, siga os passos abaixo:
          1. Instale a extensão "Live Server" no Visual Studio Code
          2. Acesse o diretório `reports` e clique com botão direito do mouse no arquivo `relatorio-final-testes.html`
          3. Selecione a opção de `Open with Live Server`

 **Modo Pipeline** (Execuções já realizadas):  
   1. Dentro do repositório desse projeto no Github, acesse o menu `Actions`
   2. Selecione a última execução dos testes desse workflow
   3. Na sessão de Artifacts, clique em `Relatório dos testes` e um arquivo zipado desse relatório será baixado para seu computador
   4. Acesse o local onde foi feito o download do relatório e descompacte a pasta zipada
   5. Dê um duplo clique no arquivo `relatorio-final-testes.html` para que ele seja aberto pelo navegador padrão do seu computador

      **Observação**: Caso esteja tendo problemas para visualizar o relatório baixado, mesmo tentando utilizar outros navegadores, siga os passos abaixo:
          1. Instale a extensão "Live Server" no Visual Studio Code
          2. Ainda no Visual Studio Code, acesse o menu `File` e selecione a opção `Open Folder...`
          3. Vá até o local onde a pasta descompactada do relatório está e a selecione (a pasta raiz) 
          4. Agora, clique com o botão direito do mouse no arquivo `relatorio-final-testes.html`
          5. Selecione a opção de `Open with Live Server`

 **Modo Pipeline** (Novas execuções):
    Conforme informado na sessão - [Rodando os Testes na Pipeline do Github](#rodando-os-testes-na-pipeline-do-github), basta realizar um push para o projeto. após cloná-lo para seu ambiente local, confome orientado na sessão - [Clone do repositório para o ambiente local](#clone-do-repositorio-para-o-ambiente-local) e acessar a execução da pipeline de testes seguindo os passos informados no passo **Modo Pipeline** (Execuções já realizadas), assim como o Relatório de testes gerado.

## Alguns pontos de melhoria:
  1. Após a exclusão de um item, e ao criar um novo em seguida, o item novo recebe um id igual ao último da lista.
  2. Está sendo possível adicionar qualquer informação nos campos email e nome, ou seja, não tem validação do padrão de email, por exemplo.
  3. Não consegui executar todos os testes de tickets, uma vez que obtive o erro "ReferenceError: someFunction is not defined" referente ao arquivo de codificação da API "server.js".
