# Project Overview - Online Banking System

## 📋 Project Description

A professional-grade Node.js/Express backend API for a complete online banking system with PostgreSQL database integration on Aiven. The system implements complete CRUD operations for users, accounts, transactions, and transfers with atomic transaction handling.

## 🎯 Core Features

### User Management
- Create, read, update, delete user profiles
- Store comprehensive user information (name, email, phone, address, etc.)
- Unique email constraint to prevent duplicates
- Automatic timestamps for created/updated records

### Account Management
- Multiple accounts per user
- Support for different account types (SAVINGS, CHECKING, BUSINESS, INVESTMENT)
- Real-time balance tracking
- Account status management (ACTIVE, INACTIVE, FROZEN, CLOSED)
- Currency support (USD, EUR, GBP, etc.)

### Transaction Management
- Deposit and withdrawal transactions
- Real-time balance updates
- Transaction history with pagination
- Balance snapshot after each transaction
- Insufficient balance validation
- Transaction statistics by type

### Transfer System
- Secure transfers between accounts
- Atomic operations (all-or-nothing)
- Bidirectional transfer tracking
- Transfer status management
- Fee calculation ready (extensible)

### Advanced Features
- Database connection pooling
- Error handling and validation
- Request logging middleware
- CORS support
- Health check endpoints
- Database statistics and monitoring
- Admin routes for system management

## 🏗️ Architecture

### Design Pattern: MVC (Model-View-Controller)
```
Request → Route → Controller → Model → Database
                     ↓
              Business Logic
                     ↓
                Response
```

### Technology Stack
- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** PostgreSQL (Aiven)
- **Driver:** pg (node-postgres)
- **Additional Libraries:**
  - dotenv (Environment management)
  - cors (Cross-origin requests)
  - joi (Schema validation)
  - uuid (ID generation)
  - bcryptjs (Password hashing - ready for auth)

## 📁 Project Structure

```
Bank/
├── src/
│   ├── config/
│   │   ├── database.js              # Database connection & pooling
│   │   ├── init-db.js               # Database initialization & schema
│   │   └── database-utils.js        # Helper functions
│   │
│   ├── models/                       # Data access layer
│   │   ├── userModel.js
│   │   ├── accountModel.js
│   │   ├── transactionModel.js
│   │   └── transferModel.js
│   │
│   ├── controllers/                  # Business logic
│   │   ├── userController.js
│   │   ├── accountController.js
│   │   ├── transactionController.js
│   │   └── transferController.js
│   │
│   ├── routes/                       # API endpoints
│   │   ├── userRoutes.js
│   │   ├── accountRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── transferRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middleware/
│   │   ├── errorHandler.js          # Global error handling
│   │   ├── validation.js            # Input validation
│   │   └── logger.js                # Request logging
│   │
│   ├── utils/
│   │   ├── helpers.js               # Utility functions
│   │   └── validationSchemas.js     # Joi validation schemas
│   │
│   └── server.js                     # Express app & startup
│
├── scripts/
│   └── test-api.js                   # API testing script
│
├── package.json
├── .env                              # Environment variables (create from .env.example)
├── .env.example                      # Template for environment variables
├── .gitignore
├── README.md                         # Project overview
├── QUICKSTART.md                     # Setup & getting started
├── API_DOCUMENTATION.md              # Complete API reference
├── AIVEN_SETUP.md                    # Database setup guide
├── PROJECT_OVERVIEW.md               # This file
└── postman-collection.json           # Postman API collection
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Accounts Table
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL (FK users.id),
  account_number VARCHAR(20) UNIQUE NOT NULL,
  account_type VARCHAR(50) NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL (FK accounts.id),
  transaction_type VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description VARCHAR(255),
  balance_after DECIMAL(15, 2),
  status VARCHAR(20) DEFAULT 'COMPLETED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transfers Table
```sql
CREATE TABLE transfers (
  id UUID PRIMARY KEY,
  from_account_id UUID NOT NULL (FK accounts.id),
  to_account_id UUID NOT NULL (FK accounts.id),
  amount DECIMAL(15, 2) NOT NULL,
  description VARCHAR(255),
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Data Flow Examples

### Workflow 1: User Registration & Account Creation
```
1. POST /api/users → Create User
2. POST /api/accounts → Create Account for User
3. GET /api/accounts/:id → Verify Account Created
```

### Workflow 2: Deposit Money
```
1. POST /api/transactions → Deposit Transaction
2. Database updates account balance
3. Transaction record created
4. GET /api/accounts/:id/balance → Check New Balance
```

### Workflow 3: Transfer Between Accounts
```
1. POST /api/transfers → Create Transfer
2. Atomic transaction begins:
   a. Debit from source account
   b. Credit to destination account
   c. Create transfer record
3. Transaction commits or rolls back on error
4. GET /api/transfers/account/:id → View Transfer History
```

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| POST | `/api/users` | Create user |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user details |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/accounts` | Create account |
| GET | `/api/accounts` | List all accounts |
| GET | `/api/accounts/:id` | Get account details |
| GET | `/api/accounts/:id/balance` | Get balance |
| PUT | `/api/accounts/:id` | Update account |
| DELETE | `/api/accounts/:id` | Delete account |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions` | List all transactions |
| GET | `/api/transactions/account/:id` | Account transactions |
| POST | `/api/transfers` | Create transfer |
| GET | `/api/transfers` | List all transfers |
| GET | `/api/admin/stats` | Database statistics |

## 🔐 Security Features

### Implemented
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation (Joi schema)
- ✅ Error handling (no sensitive data in errors)
- ✅ CORS configuration
- ✅ SSL/TLS support (Aiven)

### Ready for Implementation
- 🔧 JWT authentication
- 🔧 Password hashing (bcryptjs)
- 🔧 Rate limiting
- 🔧 Request signing
- 🔧 Role-based access control
- 🔧 Data encryption at rest

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v14+
- Aiven PostgreSQL account (free tier available)
- npm package manager

### 2. Quick Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with Aiven credentials

# Start server
npm start
```

### 3. Verify Installation
```bash
curl http://localhost:5000/health
```

### 4. Run API Tests
```bash
node scripts/test-api.js
```

## 📊 Performance Considerations

### Database Optimization
- Connection pooling (already implemented)
- Indexed primary keys
- Foreign key constraints
- Atomic transactions for data consistency

### Code Optimization
- Async/await for non-blocking operations
- Error handling with try-catch
- Efficient database queries
- Request validation middleware

### Scalability Tips
- Add read replicas for high-read workloads
- Implement caching (Redis)
- Use message queues for async operations
- Add CDN for static assets
- Horizontal scaling with load balancing

## 🧪 Testing

### Manual Testing
```bash
# Test API with curl
curl -X GET http://localhost:5000/api/users

# Test with Postman
# Import postman-collection.json into Postman
```

### Automated Testing
```bash
# Run API test script
node scripts/test-api.js
```

## 📚 Documentation Files

1. **README.md** - Project overview and features
2. **QUICKSTART.md** - Installation and quick start guide
3. **API_DOCUMENTATION.md** - Complete API reference
4. **AIVEN_SETUP.md** - Database setup and configuration
5. **PROJECT_OVERVIEW.md** - This file

## 🔧 Maintenance

### Regular Tasks
- Monitor database size
- Review error logs
- Test backup/restore
- Update dependencies
- Check performance metrics

### Common Issues & Solutions
| Issue | Solution |
|-------|----------|
| Connection timeout | Check Aiven service status |
| Authentication failed | Verify credentials in .env |
| Port in use | Change PORT in .env |
| Module not found | Run `npm install` |

## 🚦 Environment Variables

```env
DB_HOST              # Aiven PostgreSQL host
DB_PORT              # PostgreSQL port (5432)
DB_NAME              # Database name
DB_USER              # Database user
DB_PASSWORD          # Database password
PORT                 # Server port (5000)
NODE_ENV             # Environment (development/production)
JWT_SECRET           # JWT secret key
```

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Aiven Documentation](https://docs.aiven.io/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

## 📈 Future Enhancements

### Phase 1 (Core)
- [ ] JWT authentication
- [ ] Password hashing
- [ ] Rate limiting

### Phase 2 (Features)
- [ ] Transaction confirmation
- [ ] Account overdraft protection
- [ ] Scheduled transfers
- [ ] Bill payments

### Phase 3 (Advanced)
- [ ] Mobile app API
- [ ] Real-time notifications (WebSocket)
- [ ] Analytics dashboard
- [ ] Investment portfolio
- [ ] Loan management

### Phase 4 (Integration)
- [ ] Payment gateway integration
- [ ] Third-party API connections
- [ ] Mobile wallet support
- [ ] Cryptocurrency support

## 📝 Code Standards

### Naming Conventions
- camelCase for variables and functions
- PascalCase for classes
- UPPER_CASE for constants
- Descriptive names (avoid single letters)

### Error Handling
- Always use try-catch in async functions
- Provide meaningful error messages
- Log errors for debugging
- Return appropriate HTTP status codes

### Code Organization
- One model per file
- One controller per resource
- Related utility functions grouped
- Middleware arranged by purpose

## 🎯 Success Metrics

Track these KPIs in production:
- API response time (target: <200ms)
- Database query time (target: <100ms)
- Error rate (target: <0.1%)
- Uptime (target: 99.9%)
- Concurrent connections (scale as needed)

## 📞 Support & Contribution

For questions or improvements:
1. Check documentation files
2. Review API examples
3. Check error logs
4. Verify environment configuration

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**License:** MIT
