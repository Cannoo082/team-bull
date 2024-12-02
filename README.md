This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database Setup with Prisma

The project uses Prisma as the ORM (Object-Relational Mapping) for database management.  It provides type-safe database queries, automated migrations, and an intuitive query API. Prisma consists of three main components:

- **Prisma Client:** A query builder used in your application code to interact with the database.
- **Prisma Migrate:** A tool for managing database schema changes.
- **Prisma Studio:** A GUI for managing and inspecting your database. 

The database schema is defined in the prisma/schema.prisma file, and the data seeding script is located in prisma/seed.js.

### Setting up Prisma

1. Install dependencies:
```bash
npm install
```

2. Update your prisma/schema.prisma file to define your database schema.

3. Set your database URL in the .env file:

```bash
DATABASE_URL="mysql://<username>:<password>@<host>:<port>/<database_name>"
```

4. Run Prisma migrations to apply the schema:
```bash
npx prisma migrate dev --name init
```

5. Generate the Prisma Client:
Run the following command to generate the Prisma Client:

```bash
npx prisma generate
```
This command reads your schema file and creates a node_modules/.prisma directory containing the generated client code.

### Creating Dummy Data with Prisma

To populate your database with dummy data:

- **Run the Seed Script**

   To execute the seed script and populate your database, use the following command:

   ```bash
   npm run prisma:seed

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

For further information about Prisma, check official [Prisma](https://www.prisma.io/nextjs) documentation.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
