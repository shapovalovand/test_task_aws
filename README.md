## Description

Tasks: write logic
* registration
* authorization
* set up a server with a connection to the database
* 2 entities, user and files with the ability to connect to the same set (extensibility)
* CRUD (advanced)
* role and access rights
* granting access rights to third-party users
* endpoints


## Development requirement:
* express
* postgresql
* graphql
* aws

## Stack: 
* express
* Sequelize
* postgresql
* docker-compose
* graphql

## Installation

```bash
$ npm install
```


## Running the app

```bash
# up database container
$ docker-compose up
# stop database container
$ docker-compose down -v
# run server with endpoint
$ npm run start:dev
# run server aws
$ npm run start:aws
# run script aws
$ npm run start:script
```


## Improvements

Due to the fact that there were difficulties, the task was not completed completely. I was working on a problem with abs connection, only its local work was done.
In further development, I would like to fix the following points:
* bind aws to graphl
* add work with issuing file access rights to other users
* finalize the database and work with it
* add unit tests

