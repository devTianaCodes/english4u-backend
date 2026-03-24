# English4U Backend

Express and MySQL backend scaffold for the English4U portfolio project.

## Stack
- Node.js
- Express
- MySQL

## Scripts
- `npm install`
- `npm run dev`
- `npm run start`
- `npm run check`

## Environment
Use `.env.example` as the starting point for local configuration.

To enable real authentication:
- create the MySQL database referenced by `DB_NAME`
- run [schema.sql](/Users/parents/Developer/Project%20English4U/english4u-backend/db/schema.sql)
- optionally set `ADMIN_EMAILS` to one or more comma-separated email addresses before registering those accounts

## Structure
- `src/config`: environment loading
- `src/db`: database connection helpers
- `src/middleware`: auth and error middleware
- `src/modules`: feature route/controller modules
- `src/routes`: top-level route composition
- `db/schema.sql`: initial relational schema draft

## Important Rules
- AI planning files live in `/Users/parents/Developer/Project English4U/.english4u-planning`, not in this repository.
- Do not commit any changes without explicit user permission.
