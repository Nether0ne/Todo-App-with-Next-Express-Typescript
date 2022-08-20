# Todo application with Next and Express (Typescript)

## Introduction

This project demontrates a Todo application, built on `Next.js`, using REST API built on `Express` with `Prisma` library and `PostgreSQL` database.

## Features

### Client

- Basic UI using `Material UI`
- User login/register
- Create/Read/Update/Delete functionality for todos
- `SSR` implementation
- Light/Dark theme
- Form control via `react-hook-form`

### Server

- Basic `Express` server configuration
- User API (get/login/register)
- Todo API (get/post/put/delete)
- Basic request authentication via `JWT` token
- Database connection and data schema built in `Prisma`
- Module and functional tests

### Mutual

- `Turbo` setup for easy monorepository running and developing
- `Docker` images for client and server for further deployment
- Basic `GitHub CI/CD Workflows` with further deployment to `Heroku`

## Quick start

This project can be run either in Node environment or as Docker images.

### Running in Node environment

Running in Node environment requires running Postgre service.

Navigate into the project directory and run next commands in a command line:

```bash
# Install required dependencies
npm i

# Create environment files and fill them up according to examples
touch apps/client/.env
touch apps/server/.env
# For testing purposes
touch apps/server/.env.test

# Perform application build
npm run build

# Navigate to sever application directory and migrate database
cd apps/server
npm run prisma:migrate:dev

# Navigate to root directory and run dev environment
cd ../../
npm run dev
```

### Running as Docker images

Running as Docker images requires running Docker service.

Navigate into the project directory and run next commands in a command line:

```bash
# Create environment files and fill them up according to examples
touch apps/client/.env
touch apps/server/.env
touch apps/server/prisma/.env

docker-compose build
docker-compose up
```

### Application

After starting the application in Node/Docker environment it must be available at the following urls:
- Client: http://localhost:3000
- Server: http://localhost:5000

If the setup was done right, you should be able to access the application with the following credentials:

- Email: test@email.com
- Password: test
