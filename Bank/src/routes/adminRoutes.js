import express from 'express';
import { getDatabaseStats, checkConnection, dropAllTables, resetDatabase, seedTestData } from '../config/database-utils.js';

const router = express.Router();

/**
 * Admin routes - Use with caution in production
 * Consider protecting these routes with authentication
 */

// Get system health and database statistics
router.get('/stats', async (req, res) => {
  try {
    const isConnected = await checkConnection();
    const stats = await getDatabaseStats();
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      database: {
        connected: isConnected
      },
      statistics: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Check database connection
router.get('/health/db', async (req, res) => {
  try {
    const isConnected = await checkConnection();
    
    res.status(isConnected ? 200 : 500).json({
      success: isConnected,
      message: isConnected ? 'Database is connected' : 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Seed test data (development only)
router.post('/seed-data', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'This operation is not allowed in production'
    });
  }
  
  try {
    await seedTestData();
    
    res.status(200).json({
      success: true,
      message: 'Test data seeded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Reset database (development only - DANGEROUS)
router.post('/reset-database', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'This operation is not allowed in production'
    });
  }
  
  // Optional: Require a confirmation header
  const confirmation = req.headers['x-confirm-reset'];
  if (confirmation !== 'true') {
    return res.status(400).json({
      success: false,
      message: 'Add header "X-Confirm-Reset: true" to confirm this dangerous operation'
    });
  }
  
  try {
    await resetDatabase();
    
    res.status(200).json({
      success: true,
      message: 'Database has been reset. Tables will be recreated on next server restart.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * System information
 */
router.get('/info', (req, res) => {
  res.status(200).json({
    success: true,
    system: {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      platform: process.platform,
      arch: process.arch,
      cpus: require('os').cpus().length
    },
    application: {
      name: 'Online Banking System',
      version: '1.0.0',
      port: process.env.PORT || 5000
    }
  });
});

export default router;
