# BankSphere

Online banking REST API built with Node.js, Express, and PostgreSQL on Aiven.

## Features

- User, account, transaction, and transfer CRUD APIs
- Deposits and withdrawals with balance tracking
- Transfers between accounts
- PostgreSQL database initialization
- Request logging, CORS, error handling, and health checks
- Postman collection for API testing

## Requirements

- Node.js 18 or newer
- PostgreSQL database
- npm

## Setup

```bash
npm install
copy .env.example .env
```

Update `.env` with the PostgreSQL connection values, then start the API:

```bash
npm start
```

The server runs at `http://localhost:5000` by default.

## Health Check

```text
GET http://localhost:5000/health
```

## API Routes

| Area | Base route |
| --- | --- |
| Users | `/api/users` |
| Accounts | `/api/accounts` |
| Transactions | `/api/transactions` |
| Transfers | `/api/transfers` |
| Admin and diagnostics | `/api/admin` |

Full endpoint details and request examples are available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Useful Commands

```bash
npm start
npm run dev
node scripts/test-api.js
```

The API test script requires the server and database to be running. The current `npm test` command is a placeholder and exits with an error.

## Project Structure

```text
src/
├── config/        Database connection and initialization
├── controllers/   Request and business logic
├── middleware/    Logging, validation, and error handling
├── models/        PostgreSQL data access
├── routes/        Express route definitions
└── utils/         Helpers and Joi schemas
scripts/           API smoke test
```

## Security Note

Authentication and authorization are not implemented yet. Do not expose this API to the public internet until access control, secure database configuration, and production-grade financial transaction safeguards are added.
