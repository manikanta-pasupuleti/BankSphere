# Installation & Quick Start Guide

## Prerequisites

Before starting, ensure you have:
- **Node.js** v14+ installed ([Download](https://nodejs.org/))
- **npm** v6+ (comes with Node.js)
- **Aiven PostgreSQL** database set up ([Free Account](https://aiven.io))

## Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
cd Bank
npm install
```

### 2. Configure Database
Copy the example configuration:
```bash
cp .env.example .env
```

Edit `.env` with your Aiven credentials:
```
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=5432
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=your-password-here
PORT=5000
NODE_ENV=development
```

### 3. Start the Server
```bash
npm start
```

The server will start on `http://localhost:5000`

Check health:
```bash
curl http://localhost:5000/health
```

## Development Mode (Auto Reload)

For development with automatic restart on code changes:
```bash
npm run dev
```

Requires `nodemon` (included in dependencies).

## Testing the API

### Using cURL

#### 1. Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","phone":"+1234567890"}'
```

Copy the `id` from the response.

#### 2. Create an Account
Replace `USER_ID` with the ID from step 1:
```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","accountNumber":"ACC1234567890","accountType":"SAVINGS","currency":"USD"}'
```

Copy the `id` from the response.

#### 3. Make a Deposit
Replace `ACCOUNT_ID` with the ID from step 2:
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"accountId":"ACCOUNT_ID","transactionType":"DEPOSIT","amount":"1000.00","description":"Initial deposit"}'
```

#### 4. Check Balance
Replace `ACCOUNT_ID`:
```bash
curl http://localhost:5000/api/accounts/ACCOUNT_ID/balance
```

#### 5. Get All Transactions
Replace `ACCOUNT_ID`:
```bash
curl http://localhost:5000/api/transactions/account/ACCOUNT_ID
```

### Using Postman

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new collection
3. Add requests for each endpoint
4. Use the examples from API_DOCUMENTATION.md

### Using REST Client Extension (VS Code)

1. Install "REST Client" extension in VS Code
2. Create a `.rest` or `.http` file
3. Add requests:

```http
### Create User
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA"
}

### Get All Users
GET http://localhost:5000/api/users

### Create Account
POST http://localhost:5000/api/accounts
Content-Type: application/json

{
  "userId": "{{userId}}",
  "accountNumber": "ACC1234567890",
  "accountType": "SAVINGS",
  "currency": "USD"
}
```

## Project Structure

```
Bank/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── models/          # Database queries
│   ├── routes/          # API endpoints
│   ├── middleware/      # Express middleware
│   ├── utils/           # Helper functions
│   └── server.js        # Main application
├── package.json         # Dependencies
├── .env                 # Environment variables (create from .env.example)
├── .gitignore
├── README.md
├── API_DOCUMENTATION.md # Full API reference
└── AIVEN_SETUP.md      # Database setup guide
```

## Environment Variables

Create a `.env` file with:

```env
# Database Configuration
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=5432
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=your-password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT (for future use)
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
```

## Troubleshooting

### Port Already in Use
Change PORT in .env or kill the process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Database Connection Error
1. Verify Aiven credentials in .env
2. Check if Aiven service is running
3. Ensure your IP is whitelisted
4. Test connection manually with psql

### npm install Fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found Errors
Ensure you're using Node.js v14+:
```bash
node --version
npm --version
```

## Next Steps

1. Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference
2. Follow [AIVEN_SETUP.md](AIVEN_SETUP.md) for database configuration
3. Implement authentication (JWT tokens)
4. Add input validation using Joi
5. Deploy to production server

## Common Use Cases

### Create Complete Banking Flow
```bash
# 1. Create user
USER_ID=$(curl -s -X POST "..." | jq '.data.id')

# 2. Create account
ACCOUNT_ID=$(curl -s -X POST "..." | jq '.data.id')

# 3. Deposit
curl -X POST "..." -d "{\"accountId\":\"$ACCOUNT_ID\",...}"

# 4. Check balance
curl "http://localhost:5000/api/accounts/$ACCOUNT_ID/balance"
```

### Pagination Example
```bash
# Get transactions with pagination
curl "http://localhost:5000/api/transactions/account/ACCOUNT_ID?limit=20&offset=0"
```

### Filter by Date
Transactions are ordered by created_at DESC by default. Modify queries in `transactionModel.js` to add date filters.

## Production Deployment

Before deploying:

1. Set `NODE_ENV=production` in .env
2. Use strong database password
3. Enable HTTPS/TLS
4. Implement authentication (JWT)
5. Add rate limiting
6. Set up logging and monitoring
7. Configure backups
8. Use secrets management (AWS Secrets, Vault, etc.)

## Support

- Full API documentation: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Database setup: [AIVEN_SETUP.md](AIVEN_SETUP.md)
- Project README: [README.md](README.md)

## License

MIT - Free to use for educational and commercial projects
