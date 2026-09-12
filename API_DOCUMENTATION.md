# Online Banking System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the system does not have authentication. Implement JWT tokens for production use.

---

## Users Endpoints

### Create User
- **POST** `/users`
- **Request Body:**
  ```json
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
  ```
- **Response:** User object with UUID

### Get All Users
- **GET** `/users`
- **Response:** Array of all users

### Get User by ID
- **GET** `/users/:id`
- **Response:** Single user object

### Update User
- **PUT** `/users/:id`
- **Request Body:** Same as Create User
- **Response:** Updated user object

### Delete User
- **DELETE** `/users/:id`
- **Response:** Deleted user object

---

## Accounts Endpoints

### Create Account
- **POST** `/accounts`
- **Request Body:**
  ```json
  {
    "userId": "user-uuid",
    "accountNumber": "ACC12345678XXXX",
    "accountType": "SAVINGS",
    "currency": "USD"
  }
  ```
- **Account Types:** SAVINGS, CHECKING, BUSINESS, INVESTMENT

### Get All Accounts
- **GET** `/accounts`
- **Response:** Array of all accounts

### Get Account by ID
- **GET** `/accounts/:id`
- **Response:** Single account object

### Get Accounts by User
- **GET** `/accounts/user/:userId`
- **Response:** Array of accounts for specific user

### Get Account Balance
- **GET** `/accounts/:id/balance`
- **Response:** Account balance

### Update Account
- **PUT** `/accounts/:id`
- **Request Body:**
  ```json
  {
    "accountType": "CHECKING",
    "status": "ACTIVE"
  }
  ```
- **Account Status:** ACTIVE, INACTIVE, FROZEN, CLOSED

### Delete Account
- **DELETE** `/accounts/:id`
- **Response:** Deleted account object

---

## Transactions Endpoints

### Create Transaction
- **POST** `/transactions`
- **Request Body:**
  ```json
  {
    "accountId": "account-uuid",
    "transactionType": "DEPOSIT",
    "amount": "500.00",
    "description": "Monthly salary"
  }
  ```
- **Transaction Types:** DEPOSIT, WITHDRAWAL

### Get All Transactions
- **GET** `/transactions`
- **Response:** Array of all transactions

### Get Transaction by ID
- **GET** `/transactions/:id`
- **Response:** Single transaction object

### Get Transactions by Account
- **GET** `/transactions/account/:accountId`
- **Query Parameters:**
  - `limit`: Number of records (default: 50)
  - `offset`: Offset for pagination (default: 0)
- **Response:** Array of transactions for specific account

### Get Transaction Statistics
- **GET** `/transactions/account/:accountId/stats`
- **Response:** Transaction statistics by type

---

## Transfers Endpoints

### Create Transfer
- **POST** `/transfers`
- **Request Body:**
  ```json
  {
    "fromAccountId": "from-account-uuid",
    "toAccountId": "to-account-uuid",
    "amount": "100.00",
    "description": "Payment for services"
  }
  ```

### Get All Transfers
- **GET** `/transfers`
- **Response:** Array of all transfers

### Get Transfer by ID
- **GET** `/transfers/:id`
- **Response:** Single transfer object

### Get Transfers by Account
- **GET** `/transfers/account/:accountId`
- **Response:** Array of transfers (incoming and outgoing)

### Delete Transfer
- **DELETE** `/transfers/:id`
- **Response:** Deleted transfer object

---

## Error Responses

All endpoints return errors in the following format:
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes
- **400:** Bad Request (Invalid input)
- **404:** Not Found (Resource doesn't exist)
- **500:** Internal Server Error
- **409:** Conflict (Duplicate entry)

---

## Example Workflow

### 1. Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  }'
```

### 2. Create an Account for the User
```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-from-step-1",
    "accountNumber": "ACC12345678XXXX",
    "accountType": "SAVINGS",
    "currency": "USD"
  }'
```

### 3. Deposit Money
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "account-uuid-from-step-2",
    "transactionType": "DEPOSIT",
    "amount": "1000.00",
    "description": "Initial deposit"
  }'
```

### 4. Transfer Money Between Accounts
```bash
curl -X POST http://localhost:5000/api/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": "account-uuid-1",
    "toAccountId": "account-uuid-2",
    "amount": "100.00",
    "description": "Payment transfer"
  }'
```

---

## Database Schema

### Users Table
- id (UUID)
- first_name (VARCHAR)
- last_name (VARCHAR)
- email (VARCHAR UNIQUE)
- phone (VARCHAR)
- address (VARCHAR)
- city (VARCHAR)
- state (VARCHAR)
- postal_code (VARCHAR)
- country (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Accounts Table
- id (UUID)
- user_id (UUID FK)
- account_number (VARCHAR UNIQUE)
- account_type (VARCHAR)
- balance (DECIMAL)
- currency (VARCHAR)
- status (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Transactions Table
- id (UUID)
- account_id (UUID FK)
- transaction_type (VARCHAR)
- amount (DECIMAL)
- description (VARCHAR)
- balance_after (DECIMAL)
- status (VARCHAR)
- created_at (TIMESTAMP)

### Transfers Table
- id (UUID)
- from_account_id (UUID FK)
- to_account_id (UUID FK)
- amount (DECIMAL)
- description (VARCHAR)
- status (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
