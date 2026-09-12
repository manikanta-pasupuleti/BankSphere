# Aiven Database Setup Guide

## Step 1: Create Aiven Account & PostgreSQL Service

1. Visit [Aiven.io](https://aiven.io) and create a free account
2. Create a new PostgreSQL service:
   - Service name: `online-banking-db` (or your preference)
   - Cloud region: Select closest to you for better performance
   - PostgreSQL version: 14 or latest available

## Step 2: Get Connection Details

Once your PostgreSQL service is running:

1. Go to **Service Details** page
2. In the **Overview** tab, find the **Connection information** section
3. Copy the following details:
   - **Service Host** (server address)
   - **Port** (usually 5432)
   - **Database Name** (default is `defaultdb`)
   - **Username** (default is `avnadmin`)
   - **Password** (create and copy your password)

## Step 3: Update Environment Variables

1. Open the `.env` file in the project root:
   ```bash
   nano .env
   # or use your preferred editor
   ```

2. Update with your Aiven credentials:
   ```
   DB_HOST=your-database-host.aivencloud.com
   DB_PORT=5432
   DB_NAME=defaultdb
   DB_USER=avnadmin
   DB_PASSWORD=your-secure-password
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-secret-key-for-jwt
   ```

## Step 4: Verify Connection (Optional)

Test your connection using psql:

```bash
psql -h your-database-host.aivencloud.com \
     -U avnadmin \
     -d defaultdb \
     -W
```

When prompted, enter your password.

## Step 5: Start the Application

```bash
npm install
npm start
```

The application will automatically create all required tables.

## Connection Parameters Explained

| Parameter | Description | Example |
|-----------|-------------|---------|
| DB_HOST | Your Aiven PostgreSQL host | `pg-123abc.aivencloud.com` |
| DB_PORT | PostgreSQL port (default) | `5432` |
| DB_NAME | Database name | `defaultdb` |
| DB_USER | Database user | `avnadmin` |
| DB_PASSWORD | Secure password | Your secure password |

## SSL/TLS Configuration

Aiven uses SSL by default. The application is already configured to handle this:

```javascript
const pool = new Pool({
  ssl: {
    rejectUnauthorized: false
  }
});
```

For production, download the SSL certificate:
1. Go to Aiven Console → Your PostgreSQL Service
2. Download CA Certificate
3. Update configuration to use the certificate

## Troubleshooting Connection Issues

### "Connection refused"
- Verify DB_HOST is correct
- Check if Aiven service is running
- Ensure your IP is whitelisted in Aiven firewall settings

### "Authentication failed"
- Double-check DB_USER and DB_PASSWORD
- Verify credentials haven't expired
- Reset password in Aiven console if needed

### "SSL certificate problem"
- This is normal for Aiven; application already handles this
- If using strict SSL mode, download and configure CA certificate

### "Database does not exist"
- Ensure DB_NAME matches exactly (usually `defaultdb`)
- Check for typos in .env file

## Production Recommendations

1. **Use Environment Variables on Server:**
   - Never commit .env to version control
   - Use environment secrets from your hosting provider

2. **Enable Enhanced SSL:**
   - Download CA certificate from Aiven
   - Configure strict SSL verification

3. **Create Backup User:**
   - Create separate users for different services
   - Follow principle of least privilege

4. **Enable Monitoring:**
   - Set up alerts in Aiven for unusual activity
   - Monitor connection count and query performance

5. **Regular Backups:**
   - Enable automated backups in Aiven
   - Test restore process regularly

## Database Backup and Restore

### Backup using pg_dump
```bash
pg_dump -h your-host.aivencloud.com \
        -U avnadmin \
        -d defaultdb \
        -W > backup.sql
```

### Restore from backup
```bash
psql -h your-host.aivencloud.com \
     -U avnadmin \
     -d defaultdb \
     -W < backup.sql
```

## Useful Aiven Commands

View service metrics:
```bash
# In Aiven Console: Services → Your PostgreSQL → Metrics
```

Connect with pgAdmin (visual client):
1. Download pgAdmin
2. Create new server connection using Aiven credentials
3. Browse and manage database visually

## Cost Optimization

- Aiven offers free tier with limited resources
- Upgrade plan as your data grows
- Monitor storage and compute usage
- Consider data archiving for old transactions

## Additional Resources

- [Aiven Documentation](https://docs.aiven.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pg-promise Documentation](https://vitaly-t.github.io/pg-promise/)
- [Node.js PostgreSQL Client](https://node-postgres.com/)
