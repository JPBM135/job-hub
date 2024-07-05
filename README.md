# Job Hub

## Description

This is a job hub application that allows users to post jobs and apply for jobs. Users can also view the jobs they have posted and applied for.

## Table of Contents

- [Job Hub](#job-hub)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Server](#server)
    - [Client](#client)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

To install the necessary dependencies, run the following command:

```bash
yarn --immutable
```

> If you never heard of Yarn, it's a package manager that is compatible with NPM. You can learn more on the official website: <https://yarnpkg.com/getting-started>

## Usage

This application has an Docker Compose file that allows you to run the database and the application in a container.

> Install Docker: <https://docs.docker.com/engine/install/>

To start the application, run the following command:

```bash
# Start the database
docker compose up

# Run the migrations
yarn workspace @job-hub/server recreate-db

# Start the server and the client
yarn workspace @job-hub/client start-servers
```

The application will be available at <http://localhost:4200>.

### Server

The server is a GraphQL API that uses Apollo Server and Knex. It is available at <http://localhost:4000/graphql>.

> Apollo Server: <https://www.apollographql.com/docs/apollo-server/>
> Knex: <http://knexjs.org/>

### Client

The client is an Angular 18 application that uses Apollo Client and Angular Material. It is available at <http://localhost:4200>.

> Apollo Client: <https://the-guild.dev/graphql/apollo-angular/docs>

> Angular: <https://angular.dev>

> Angular Material: <https://material.angular.io/>

> [!WARNING]
> This application uses no Zone.js detection, please read more about this on the official documentation: <https://angular.dev/guide/experimental/zoneless>

## Contributing

Contributions are welcome. Please open up an issue or create PR if you would like to help out!

All the PRs should be made to the `main` branch and follow the style guidelines provided by the ESLint and Prettier.

**Happy Coding!**

## License

This project is licensed under the MIT license.
