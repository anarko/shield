# Shield Challenge

A TypeScript-based API project built with the Fastify framework.

## Prerequisites

- Node.js (v18 or higher)
- npm package manager
- PostgreSQL database or Docker Compose

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up the database container (optional):

   A Docker Compose file is provided for PostgreSQL database configuration.
   The configuration is compatible with the example `.env` file in the repository.

```bash
cd docker
docker-compose up
```

3. Configure environment variables:
   Copy the example `.env` file to the root directory. You can use it as-is for local Docker container setup.

## Running the Application

```bash
npm run dev
```
