# Scaffold (Node.js - NestJS - Prisma)

A [Node.js](https://nodejs.org/en) scaffold with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/).

## Getting started

To get started, first run:

```bash
docker compose up -d
```

Next, install dependencies via npm:

```bash
npm install
```

Next, create a `.env` file in the root of your project and set the `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY` and `DATABASE_URL` environment variable. `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` must be generated with RS256 algorithm, and converted to base64.

```env
JWT_PRIVATE_KEY="${private_key_converted_base64}"
JWT_PUBLIC_KEY="${public_key_converted_base64}"
DATABASE_URL="postgresql://docker:docker@localhost:5432/scaffold-nestjs?schema=public"
```

Then run the command below for the database migrations:

```bash
npm run prisma -- migration:latest
```

Then start the development server:

```bash
npm run start:dev
```

Your API will be available at [http://localhost:3333](http://localhost:3333)

API documentation using Swagger will be available at [http://localhost:3333/api](http://localhost:3333/api)

### Project structure

The scaffold is built as a Node.js API using NestJS and prisma, using the `src` folder for application codes, `prisma` for migrations and development database, and the `test` folder containing common configurations and codes for application testing. Using the `.github/workflows` folder for configuration CI/CD.
