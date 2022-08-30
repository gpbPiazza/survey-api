# Clean API

> _Objetivo: Desenvolver uma API seguindo os ensimanetos do livro Clean Architecture e utilizar TDD durante o desenvolvimento do projeto inteiro_.

### 📋 Pré-requisitos

Você precisa ter instalado:

- NodeJS 14.15.x | | maior

- Mongodb 4.2.x | |  maior

### 🔧 Instalação

Com os pré-requisitos instalados na pasta raiz do projeto, mesmo diretório deste arquivo.

Execute em seu terminal:

```
npm install
```
Para instalar as dependências do projeto

### 🚇 Executando o projeto local

Na raiz do projeto execute:

Para iniciar seu banco local
```
  sudo service mongod start
```

Para iniciar o projeto
```
  npm run start
```

O projeto ira ser executado na porta `http://localhost:5050/`.

## ⚙️ Executando os testes

Execute:
- `npm run test` para rodar todos os testes da aplicação
- `npm run test:unit` para rodar todos os testes unitários
- `npm run test:integration` para rodar todos os testes de integração
- `npm run test:verbose` para rodar todos os testes da aplicação com as flags `--silent` e `--noStackTrace` desabilitadas
- `npm run test:watch` ira apenas executar os testes que você alterar ou os testes que referenciam o código de produção que você alterou
- `npm run test:ci` para rodar todos os testes da aplicação e gerar o arquivo de relatório de cobertura de teste

## 📦 Documentação

[Diagrama de classes](https://drive.google.com/file/d/1Ph5pmn-KZJILFRX_DQYLz5iVHq3gcw2D/view?usp=sharing)

Swegger do projeto WIP....
Diagrama arquitetura do projeto WIP....

<!-- Domain - Onde ficam os casos de uso e as entidades.

Data - Implementação dos casos de uso. Onde ficam as regras de negócio.

Infra - Implementações que usam libs de terceiros

Presentation - Onde preparamos os dados que serão "apresentados" pela view (no caso da API, a view é apenas um JSON ou XML)

Validation - Onde fazemos validações

Main - Onde fazemos a composição das classes -->

## 🎁 Melhorias?

Sinta-se 100% livre para abrir um pull request a ideia que este projeto seja vivo e sempre atualizado 🤓.

---
⌨️ com ❤️ por Gabriel Piazza 😊
