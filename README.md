# Novuel - Open Source AI Writing App

Novuel is an open-source AI writing application built with Nuxt 3, Nuxt UI, and Novel Vue.

This guide will help you set up the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (version 18 or higher)
- Yarn package manager
- Docker
- Docker Compose

## Setup

1. Clone the repository:

```bash
git clone https://github.com/your-repo/novuel.git
cd novuel
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory of the project by copying the `.env.example` file:

```bash
cp .env.example .env
```

4. Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

5. Run the prisma database migrations and generate the Prisma client:

```bash
yarn prisma:migrate:dev
yarn prisma:migrate:generate
```

6. Start the development server:

```bash
yarn dev
```

Now, you can access the application at http://localhost:3000.
