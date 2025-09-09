const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Data storage directory
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const HEALTH_DATA_FILE = path.join(DATA_DIR, 'health_data.json');
const LOCATION_DATA_FILE = path.join(DATA_DIR, 'location_data.json');

// Initialize data directory and files
async function initializeDataStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize files if they don't exist
    const files = [
      { file: USERS_FILE, default: [] },
      { file: HEALTH_DATA_FILE, default: [] },
      { file: LOCATION_DATA_FILE, default: [] }
    ];
    
    for (const { file, default: defaultData } of files) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, JSON.stringify(defaultData, null, 2));
      }
    }
    
    console.log('Data storage initialized');
  } catch (error) {
    console.error('Error initializing data storage:', error);
  }
}

// Data validation functions
function validateHealthData(data) {
  const requiredFields = ['selectedTypes', 'lastUpdated'];
  const validTypes = [
    'heartRate', 'bloodPressure', 'restingHeartRate',
    'steps', 'distance', 'activeEnergy', 'exerciseTime',
    'sleepAnalysis', 'bedtime', 'weight', 'height', 'bmi'
  ];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (!Array.isArray(data.selectedTypes)) {
    throw new Error('selectedTypes must be an array');
  }
  
  for (const type of data.selectedTypes) {
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid health data type: ${type}`);
    }
  }
  
  return true;
}

function validateLocationData(data) {
  const requiredFields = ['latitude', 'longitude', 'timestamp'];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
    throw new Error('Latitude and longitude must be numbers');
  }
  
  if (data.latitude < -90 || data.latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  
  if (data.longitude < -180 || data.longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }
  
  return true;
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Receive health data
app.post('/api/health-data', async (req, res) => {
  try {
    const { userId, healthData, timestamp } = req.body;
    
    if (!userId || !healthData) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId and healthData' 
      });
    }
    
    // Validate health data
    validateHealthData(healthData);
    
    // Create data entry
    const entry = {
      id: Date.now().toString(),
      userId,
      timestamp: timestamp || new Date().toISOString(),
      healthData,
      receivedAt: new Date().toISOString()
    };
    
    // Read existing data
    const existingData = JSON.parse(await fs.readFile(HEALTH_DATA_FILE, 'utf8'));
    
    // Add new entry
    existingData.push(entry);
    
    // Save back to file
    await fs.writeFile(HEALTH_DATA_FILE, JSON.stringify(existingData, null, 2));
    
    console.log(`Health data received from user ${userId}:`, {
      types: healthData.selectedTypes,
      timestamp: entry.timestamp
    });
    
    res.json({ 
      success: true, 
      message: 'Health data received successfully',
      entryId: entry.id
    });
    
  } catch (error) {
    console.error('Error receiving health data:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to process health data' 
    });
  }
});

// Receive location data
app.post('/api/location-data', async (req, res) => {
  try {
    const { userId, locationData, timestamp } = req.body;
    
    if (!userId || !locationData) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId and locationData' 
      });
    }
    
    // Validate location data
    validateLocationData(locationData);
    
    // Create data entry
    const entry = {
      id: Date.now().toString(),
      userId,
      timestamp: timestamp || new Date().toISOString(),
      locationData,
      receivedAt: new Date().toISOString()
    };
    
    // Read existing data
    const existingData = JSON.parse(await fs.readFile(LOCATION_DATA_FILE, 'utf8'));
    
    // Add new entry
    existingData.push(entry);
    
    // Save back to file
    await fs.writeFile(LOCATION_DATA_FILE, JSON.stringify(existingData, null, 2));
    
    console.log(`Location data received from user ${userId}:`, {
      lat: locationData.latitude,
      lng: locationData.longitude,
      timestamp: entry.timestamp
    });
    
    res.json({ 
      success: true, 
      message: 'Location data received successfully',
      entryId: entry.id
    });
    
  } catch (error) {
    console.error('Error receiving location data:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to process location data' 
    });
  }
});

// Receive combined data
app.post('/api/combined-data', async (req, res) => {
  try {
    const { userId, locationData, healthData, timestamp } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'Missing required field: userId' 
      });
    }
    
    const results = [];
    
    // Process location data if provided
    if (locationData) {
      try {
        validateLocationData(locationData);
        
        const locationEntry = {
          id: Date.now().toString() + '_loc',
          userId,
          timestamp: timestamp || new Date().toISOString(),
          locationData,
          receivedAt: new Date().toISOString()
        };
        
        const existingLocationData = JSON.parse(await fs.readFile(LOCATION_DATA_FILE, 'utf8'));
        existingLocationData.push(locationEntry);
        await fs.writeFile(LOCATION_DATA_FILE, JSON.stringify(existingLocationData, null, 2));
        
        results.push({ type: 'location', success: true, entryId: locationEntry.id });
      } catch (error) {
        results.push({ type: 'location', success: false, error: error.message });
      }
    }
    
    // Process health data if provided
    if (healthData) {
      try {
        validateHealthData(healthData);
        
        const healthEntry = {
          id: Date.now().toString() + '_health',
          userId,
          timestamp: timestamp || new Date().toISOString(),
          healthData,
          receivedAt: new Date().toISOString()
        };
        
        const existingHealthData = JSON.parse(await fs.readFile(HEALTH_DATA_FILE, 'utf8'));
        existingHealthData.push(healthEntry);
        await fs.writeFile(HEALTH_DATA_FILE, JSON.stringify(existingHealthData, null, 2));
        
        results.push({ type: 'health', success: true, entryId: healthEntry.id });
      } catch (error) {
        results.push({ type: 'health', success: false, error: error.message });
      }
    }
    
    console.log(`Combined data received from user ${userId}:`, results);
    
    res.json({ 
      success: true, 
      message: 'Data processed successfully',
      results
    });
    
  } catch (error) {
    console.error('Error receiving combined data:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to process data' 
    });
  }
});

// Get data summary
app.get('/api/data-summary', async (req, res) => {
  try {
    const healthData = JSON.parse(await fs.readFile(HEALTH_DATA_FILE, 'utf8'));
    const locationData = JSON.parse(await fs.readFile(LOCATION_DATA_FILE, 'utf8'));
    
    const summary = {
      totalHealthEntries: healthData.length,
      totalLocationEntries: locationData.length,
      uniqueUsers: new Set([
        ...healthData.map(entry => entry.userId),
        ...locationData.map(entry => entry.userId)
      ]).size,
      lastUpdated: new Date().toISOString()
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Error getting data summary:', error);
    res.status(500).json({ error: 'Failed to get data summary' });
  }
});

// Get user data
app.get('/api/user/:userId/data', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const healthData = JSON.parse(await fs.readFile(HEALTH_DATA_FILE, 'utf8'));
    const locationData = JSON.parse(await fs.readFile(LOCATION_DATA_FILE, 'utf8'));
    
    const userHealthData = healthData.filter(entry => entry.userId === userId);
    const userLocationData = locationData.filter(entry => entry.userId === userId);
    
    res.json({
      userId,
      healthData: userHealthData,
      locationData: userLocationData,
      totalEntries: userHealthData.length + userLocationData.length
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Start server
async function startServer() {
  await initializeDataStorage();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available:`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   POST /api/health-data - Receive health data`);
    console.log(`   POST /api/location-data - Receive location data`);
    console.log(`   POST /api/combined-data - Receive both types`);
    console.log(`   GET  /api/data-summary - Get data summary`);
    console.log(`   GET  /api/user/:userId/data - Get user data`);
  });
}

startServer().catch(console.error);
