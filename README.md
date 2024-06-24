
<span>
  <img align="right" width="95" src="https://sting-2.fieldcontrol.com.br/assets/images/field/field_logo_azul.png"></img>
  <h1 align="left">MorgulBlade - Criação de PMOCs</h1>
</span>

## Visão Geral
O projeto Molgulblade é um sistema destinado à criação e gerenciamento de PMOCS (Planos de Manutenção, Operação e Controle) para diversas áreas de atuação. Inspirado na lendária lâmina Morgul, do universo de "O Senhor dos Anéis", o Molgulblade busca oferecer uma solução poderosa e confiável para auxiliar na gestão eficiente dos planos e processos relacionados às operações e manutenções.

## Tecnologias

Esse repositório usa [Yarn](https://yarnpkg.com/) para o gerenciamento de pacotes e do monorepo.

### Alguns comandos úteis

- `yarn install` - Instala as dependências de todos os projetos
- `yarn lint` - Roda o linter em todos os projetos
- `yarn workspace <workspace> <command>` - Roda o comando no workspace especificado
- `yarn test` - Roda os testes de todos os projetos

### Algumas peculiaridades do yarn

- O yarn cria um cache global de pacotes, então a node_modules de cada projeto é um link simbólico para o cache global. Isso significa que se você rodar `yarn install` em um projeto, o cache global será atualizado e todos os outros projetos que usam o mesmo pacote terão a node_modules atualizada também.

### Sobre o Linter

- Todos os projetos foram configurados com o [ESLint](https://eslint.org/) e o [Prettier](https://prettier.io/). Seguindo uma configuração chamada neon: [Npm](https://www.npmjs.com/package/eslint-config-neon), [Github](https://github.com/ICrawl/eslint-config-neon)

- Algumas modificações foram feitas por escolha pessoal e por necessidade de compatibilidade, principalmente com o Angular.


## Banco de dados

A configuração do banco de dados e todas as configurações de ambiente estão em um docker-compose, para rodar o banco de dados basta rodar o comando abaixo:

```bash
docker-compose up --build --detach
```

Caso não tenha instalado, recomendo seguir o tutorial na [Wiki da Field](https://github.com/FieldControl/home/wiki/Começando-no-Docker-(beta))

## Rodar o start-servers (Inicia todos os projetos necessários)

```bash
nvm use
yarn install
yarn workspace @morgulblade/client start-servers
```

## Client

O client é uma aplicação Angular, Tailwind e um salzinho de Fuse que se comunica com o servidor para autenticação e PMOCs.

### Tecnologias

- [Angular 16](https://angular.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [Fuse](https://angular-material.fusetheme.com)

### Rodar client

> Node 18

```bash
# Dentro do diretório packages/client
nvm use
yarn install
yarn start-dev
```

## Server

O server consiste em uma API GraphQL que se comunica com o banco de dados para registro de dados e com o client para autenticação e PMOCs.

### Tecnologias

- [Node 18](https://nodejs.org/en/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Knex](http://knexjs.org/)
- [SWC](https://swc.rs/)

### Rodar server

> Node 18

```bash
# Dentro do diretório packages/server
nvm use
yarn install
yarn start-dev # Roda o servidor em modo de desenvolvimento
yarn start-watch # Roda o servidor em modo de desenvolvimento com hot reload
```

### Rivendell

Esse é o banco próprio do MorgulBlade, as migrações relacionadas com esse banco se encontram dentro do `packages/server`

### Rodar as migrações

```bash
# Dentro do diretório packages/server
yarn migration-run
```

### Criar uma migração

```bash
# Dentro do diretório packages/server
yarn migration-create <nome_da_migracao>
```

As migrações devem seguir o mesmo esquema de nome do [EyeOfSauron](https://github.com/FieldControl/eyeofsauron)

## Shared

O shared é um pacote que contém código compartilhado entre o client e o server, como por exemplo os tipos do GraphQL e as entidades do banco de dados.

### Caso especial do shared

Pelo fato do shared fazer parte do monorepo, ele precisa de uma integração especial com os instaladores de pacotes do Node, como o yarn e o npm. Para isso, foi criado um script que roda automaticamente quando o yarn ou o npm instalam o shared em algum projeto. Esse script é responsável por criar os links simbólicos necessários para que o shared funcione corretamente.

<br/>

---

<h4 align="center">
  Feito com carinho, FieldControl 💙
</h4>

---
