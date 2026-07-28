# Online Banking System

A clean, professional-grade Node.js/Express backend for an online banking system with complete CRUD operations and Aiven PostgreSQL database integration.

## Features

✅ User Management (Create, Read, Update, Delete)
✅ Account Management (Multiple accounts per user)
✅ Transaction Management (Deposits, Withdrawals)
✅ Transfer System (Between accounts)
✅ Balance Management with Atomic Transactions
✅ Transaction History with Pagination
✅ RESTful API Architecture
✅ PostgreSQL Database (Aiven)
✅ Error Handling & Validation
✅ Logging Middleware
✅ CORS Enabled

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Aiven)
- **ORM:** pg (node-postgres)
- **Additional Libraries:**
  - `dotenv` - Environment variables
  - `cors` - Cross-Origin Resource Sharing
  - `joi` - Schema validation
  - `uuid` - Unique ID generation
  - `bcryptjs` - Password hashing (future use)

## Project Structure

```
Bank/
├── src/
│   ├── config/
│   │   ├── database.js           # Database connection
│   │   └── init-db.js            # Database initialization
│   ├── controllers/
│   │   ├── userController.js     # User CRUD logic
│   │   ├── accountController.js  # Account CRUD logic
│   │   ├── transactionController.js # Transaction logic
│   │   └── transferController.js # Transfer logic
│   ├── models/
│   │   ├── userModel.js          # User queries
│   │   ├── accountModel.js       # Account queries
│   │   ├── transactionModel.js   # Transaction queries
│   │   └── transferModel.js      # Transfer queries
│   ├── routes/
│   │   ├── userRoutes.js         # User endpoints
│   │   ├── accountRoutes.js      # Account endpoints
│   │   ├── transactionRoutes.js  # Transaction endpoints
│   │   └── transferRoutes.js     # Transfer endpoints
│   ├── middleware/
│   │   ├── errorHandler.js       # Global error handling
│   │   ├── validation.js         # Input validation
│   │   └── logger.js             # Request logging
│   ├── utils/
│   │   └── helpers.js            # Utility functions
│   └── server.js                 # Main application file
├── package.json                  # Dependencies
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── API_DOCUMENTATION.md          # API endpoints documentation
└── README.md                     # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Aiven PostgreSQL account and connection details

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd Bank
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` with your Aiven database credentials:
   ```
   DB_HOST=your-aiven-host.aivencloud.com
   DB_PORT=5432
   DB_NAME=defaultdb
   DB_USER=avnadmin
   DB_PASSWORD=your-password
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the application**
   
   For development (with auto-reload):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

5. **Verify the server**
   ```bash
   curl http://localhost:5000/health
   ```

## API Endpoints Summary

### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Accounts
- `POST /api/accounts` - Create account
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `GET /api/accounts/user/:userId` - Get user's accounts
- `GET /api/accounts/:id/balance` - Get account balance
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Transactions
- `POST /api/transactions` - Create transaction (deposit/withdrawal)
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `GET /api/transactions/account/:accountId` - Get account transactions
- `GET /api/transactions/account/:accountId/stats` - Get transaction stats

### Transfers
- `POST /api/transfers` - Create transfer between accounts
- `GET /api/transfers` - Get all transfers
- `GET /api/transfers/:id` - Get transfer by ID
- `GET /api/transfers/account/:accountId` - Get account transfers
- `DELETE /api/transfers/:id` - Delete transfer

## Database Setup

The application automatically creates the required database tables on startup. Tables created:

- **users** - Customer information
- **accounts** - Bank accounts with balance tracking
- **transactions** - Deposit and withdrawal records
- **transfers** - Inter-account transfer records

## Usage Examples

### Create a New User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d {
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
```

### Create an Account
```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Content-Type: application/json" \
  -d {
    "userId": "user-id-here",
    "accountNumber": "ACC1234567890",
    "accountType": "SAVINGS",
    "currency": "USD"
  }
```

### Make a Deposit
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d {
    "accountId": "account-id-here",
    "transactionType": "DEPOSIT",
    "amount": "1000.00",
    "description": "Initial deposit"
  }
```

### Transfer Money
```bash
curl -X POST http://localhost:5000/api/transfers \
  -H "Content-Type: application/json" \
  -d {
    "fromAccountId": "from-account-id",
    "toAccountId": "to-account-id",
    "amount": "100.00",
    "description": "Payment"
  }
```

## Key Features Explained

### Account Balance Management
- Real-time balance updates on deposits/withdrawals
- Atomic transactions using database transactions
- Prevents overdrafts (checks balance before withdrawal)

### Transaction Recording
- All transactions are recorded with timestamp
- Balance snapshot after each transaction
- Support for multiple transaction types

### Transfer System
- Secure fund transfers between accounts
- Atomic operations (all-or-nothing)
- Records incoming and outgoing transfers

### Error Handling
- Comprehensive error messages
- Validation for all inputs
- Proper HTTP status codes

## Security Considerations

For production use, implement:
- JWT authentication
- Password hashing with bcryptjs
- Rate limiting
- Input sanitization
- SQL injection prevention (already using parameterized queries)
- HTTPS/TLS encryption
- Data encryption for sensitive fields

## Contributing

Guidelines for development:
- Follow the existing code structure
- Use meaningful commit messages
- Test all endpoints before submitting changes
- Document any new endpoints

## License

MIT License - feel free to use for educational and commercial purposes.

## Support

For issues or questions:
1. Check the API_DOCUMENTATION.md for endpoint details
2. Verify your .env configuration
3. Check the server logs for error messages
4. Ensure Aiven database is accessible from your network

## Future Enhancements

- [ ] JWT Authentication
- [ ] Role-based access control
- [ ] Transaction confirmation OTP
- [ ] Mobile app integration
- [ ] Payment gateway integration
- [ ] Scheduled transfers
- [ ] Loan management
- [ ] Investment portfolio
- [ ] Advanced analytics
- [ ] WebSocket for real-time updates
#   B a n k S p h e r e  
 