# Prisma + PostgreSQL Setup Guide

This project is now configured with **Prisma ORM** and **PostgreSQL** database using Docker.

## 🚀 Quick Start

### 1. Start the PostgreSQL Database with Docker

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the following credentials:
- **Host**: localhost
- **Port**: 5432
- **Database**: leetcode
- **Username**: postgres
- **Password**: postgres

### 2. Run Prisma Migration

Create the database tables based on your schema:

```bash
npx prisma migrate dev --name init
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

## 📝 Database Management

### View Database in Prisma Studio

Open a visual editor for your database:

```bash
npx prisma studio
```

This will open `http://localhost:5555` in your browser.

### Create a New Migration

After modifying your `schema.prisma` file:

```bash
npx prisma migrate dev --name your_migration_name
```

### Reset the Database

⚠️ **Warning**: This will delete all data!

```bash
npx prisma migrate reset
```

## 🔧 Configuration Files

### `.env`
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/leetcode?schema=public"
```

### `prisma/schema.prisma`
Contains your database schema and models. Currently includes a sample `User` model.

### `docker-compose.yml`
Configures the PostgreSQL container with persistent data storage.

## 📚 Common Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start PostgreSQL in background |
| `docker-compose down` | Stop PostgreSQL |
| `docker-compose logs postgres` | View PostgreSQL logs |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create and apply migration |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema without migration |

## 💻 Usage Example

```javascript
// Import Prisma Client
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create a new user
async function createUser() {
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'John Doe',
    },
  })
  console.log(user)
}

// Find all users
async function getUsers() {
  const users = await prisma.user.findMany()
  console.log(users)
}
```

## 🛠️ Troubleshooting

### Docker not running?
Make sure Docker Desktop is installed and running.

### Connection refused?
Ensure the PostgreSQL container is running: `docker ps`

### Port already in use?
Change the port in `docker-compose.yml`:
```yaml
ports:
  - '5433:5432'  # Use 5433 instead
```
And update your `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/leetcode?schema=public"
```

## 📖 Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
