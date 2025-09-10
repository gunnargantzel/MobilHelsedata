// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const { ConfidentialClientApplication } = require('@azure/msal-node');
const { ClientSecretCredential } = require('@azure/identity');
const WebApi = require('dataverse-webapi');

// Load configuration
let config;
try {
  config = require('./azure-config.js');
} catch (error) {
  console.log('Azure config not found. Using example config.');
  config = require('./azure-config.example.js');
}

const app = express();
const PORT = config.server.port || 3000;

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: config.azure.clientId,
    clientSecret: config.azure.clientSecret,
    authority: `https://login.microsoftonline.com/${config.azure.tenantId}`,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 'Info',
    }
  }
};

// Initialize MSAL
const cca = new ConfidentialClientApplication(msalConfig);

// Dataverse Configuration
const dataverseConfig = {
  webApiUrl: config.dataverse.url,
  apiVersion: config.dataverse.apiVersion
};

// Initialize Dataverse client
let dataverseClient;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

app.use(session({
  secret: config.server.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, config.server.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Initialize Dataverse connection
async function initializeDataverse() {
  try {
    // Check if Dataverse credentials are configured
    if (config.dataverse.clientId === 'your-dataverse-client-id' || 
        config.dataverse.clientSecret === 'your-dataverse-client-secret') {
      console.log('⚠️  Dataverse credentials not configured. Skipping Dataverse connection.');
      return false;
    }

    const credential = new ClientSecretCredential(
      config.azure.tenantId,
      config.dataverse.clientId,
      config.dataverse.clientSecret
    );

    dataverseClient = new WebApi(dataverseConfig, credential);
    
    // Test connection
    await dataverseClient.retrieve('WhoAmI', '?$select=UserId');
    console.log('✅ Dataverse connection established');
    console.log(`📊 Dataverse URL: ${config.dataverse.url}`);
    console.log(`🏢 Environment ID: ${config.dataverse.environmentId}`);
    
    return true;
  } catch (error) {
    console.error('❌ Dataverse connection failed:', error.message);
    console.log('💡 Make sure to configure DATAVERSE_CLIENT_ID and DATAVERSE_CLIENT_SECRET environment variables');
    return false;
  }
}

// Create Dataverse tables if they don't exist
async function createDataverseTables() {
  try {
    // Create HealthData table
    const healthTableDefinition = {
      '@odata.type': 'Microsoft.Dynamics.CRM.EntityMetadata',
      'LogicalName': 'new_healthdata',
      'DisplayName': 'Health Data',
      'SchemaName': 'new_healthdata',
      'Attributes': [
        {
          '@odata.type': 'Microsoft.Dynamics.CRM.StringAttributeMetadata',
          'LogicalName': 'new_userid',
          'DisplayName': 'User ID',
          'SchemaName': 'new_userid',
          'MaxLength': 100,
          'RequiredLevel': 'ApplicationRequired'
        },
        {
          '@odata.type': 'Microsoft.Dynamics.CRM.StringAttributeMetadata',
          'LogicalName': 'new_datatype',
          'DisplayName': 'Data Type',
          'SchemaName': 'new_datatype',
          'MaxLength': 50,
          'RequiredLevel': 'ApplicationRequired'
        },
        {
          '@odata.type': 'Microsoft.Dynamics.CRM.StringAttributeMetadata',
          'LogicalName': 'new_datavalue',
          'DisplayName': 'Data Value',
          'SchemaName': 'new_datavalue',
          'MaxLength': 1000
        },
        {
          '@odata.type': 'Microsoft.Dynamics.CRM.DateTimeAttributeMetadata',
          'LogicalName': 'new_timestamp',
          'DisplayName': 'Timestamp',
          'SchemaName': 'new_timestamp',
          'RequiredLevel': 'ApplicationRequired'
        }
      ]
    };

    // Create LocationData table
    const locationTableDefinition = {
      '@odata.type': 'Microsoft.Dynamics.CRM.EntityMetadata',
      'LogicalName': 'new_locationdata',
      'DisplayName': 'Location Data',
      'SchemaName': 'new_locationdata',
      'Attributes': [
        {
          '@odata.type': 'Microsoft.Dynamics.CRM.StringAttributeMetadata',
          'LogicalName': 'new_userid',
          'DisplayName': 'User ID',
          'SchemaName': 'new_userid',
          'MaxLength': 100,
          'RequiredLevel': 'ApplicationRequired'
        },
        {
          '@odata.type': 'Microsoft.Dynamics.CRM.DecimalAttributeMetadata',
          'LogicalName': 'new_latitude',
          'DisplayName': 'Latitude',
          'SchemaName': 'new_latitude',
          'Precision': 10,
          'RequiredLevel': 'ApplicationRequired'
        },
        {
          '@odata.type': 'Microsoft.Dynamics.CRM.DecimalAttributeMetadata',
          'LogicalName': 'new_longitude',
          'DisplayName': 'Longitude',
          'SchemaName': 'new_longitude',
          'Precision': 10,
          'RequiredLevel': 'ApplicationRequired'
        },
        {
          '@odata.type': 'Microsoft.Dynamics.CRM.DecimalAttributeMetadata',
          'LogicalName': 'new_accuracy',
          'DisplayName': 'Accuracy',
          'SchemaName': 'new_accuracy',
          'Precision': 5
        },
        {
          '@odata.type': 'Microsoft.Dynamics.CRM.DateTimeAttributeMetadata',
          'LogicalName': 'new_timestamp',
          'DisplayName': 'Timestamp',
          'SchemaName': 'new_timestamp',
          'RequiredLevel': 'ApplicationRequired'
        }
      ]
    };

    console.log('📋 Dataverse tables would be created here');
    console.log('Note: Table creation requires admin privileges in Dataverse');
    
  } catch (error) {
    console.error('Error creating Dataverse tables:', error);
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    azureConnected: !!dataverseClient
  });
});

// Azure AD login
app.get('/auth/login', async (req, res) => {
  try {
    const authCodeUrlParameters = {
      scopes: config.azure.scopes,
      redirectUri: config.azure.redirectUri,
    };

    const response = await cca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Azure AD callback
app.post('/auth/callback', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }
    
    const tokenRequest = {
      code: code,
      scopes: config.azure.scopes,
      redirectUri: config.azure.redirectUri,
    };

    const response = await cca.acquireTokenByCode(tokenRequest);
    
    // Create JWT token for our app
    const jwtToken = jwt.sign(
      { 
        userId: response.account.homeAccountId,
        email: response.account.username,
        name: response.account.name,
        tenantId: config.azure.tenantId
      },
      config.server.jwtSecret,
      { expiresIn: '24h' }
    );

    console.log(`✅ User authenticated: ${response.account.username}`);

    res.json({ 
      success: true, 
      token: jwtToken,
      user: {
        email: response.account.username,
        name: response.account.name,
        tenantId: config.azure.tenantId
      }
    });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
});

// Receive health data (with authentication)
app.post('/api/health-data', authenticateToken, async (req, res) => {
  try {
    const { healthData, timestamp } = req.body;
    const userId = req.user.userId;

    if (!healthData) {
      return res.status(400).json({ 
        error: 'Missing required field: healthData' 
      });
    }

    // Validate health data
    validateHealthData(healthData);

    // Save to Dataverse
    if (dataverseClient) {
      for (const dataType of healthData.selectedTypes) {
        const record = {
          'new_userid': userId,
          'new_datatype': dataType,
          'new_datavalue': JSON.stringify(healthData.data[dataType] || {}),
          'new_timestamp': new Date(timestamp || new Date()).toISOString()
        };

        await dataverseClient.create('new_healthdata', record);
      }
    }

    console.log(`Health data received from user ${userId}:`, {
      types: healthData.selectedTypes,
      timestamp: timestamp || new Date().toISOString()
    });

    res.json({ 
      success: true, 
      message: 'Health data saved to Dataverse',
      userId: userId
    });

  } catch (error) {
    console.error('Error receiving health data:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to process health data' 
    });
  }
});

// Receive location data (with authentication)
app.post('/api/location-data', authenticateToken, async (req, res) => {
  try {
    const { locationData, timestamp } = req.body;
    const userId = req.user.userId;

    if (!locationData) {
      return res.status(400).json({ 
        error: 'Missing required field: locationData' 
      });
    }

    // Validate location data
    validateLocationData(locationData);

    // Save to Dataverse
    if (dataverseClient) {
      const record = {
        'new_userid': userId,
        'new_latitude': locationData.latitude,
        'new_longitude': locationData.longitude,
        'new_accuracy': locationData.accuracy || 0,
        'new_timestamp': new Date(timestamp || new Date()).toISOString()
      };

      await dataverseClient.create('new_locationdata', record);
    }

    console.log(`Location data received from user ${userId}:`, {
      lat: locationData.latitude,
      lng: locationData.longitude,
      timestamp: timestamp || new Date().toISOString()
    });

    res.json({ 
      success: true, 
      message: 'Location data saved to Dataverse',
      userId: userId
    });

  } catch (error) {
    console.error('Error receiving location data:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to process location data' 
    });
  }
});

// Get user data from Dataverse
app.get('/api/user/data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!dataverseClient) {
      return res.status(503).json({ error: 'Dataverse not available' });
    }

    // Get health data
    const healthData = await dataverseClient.retrieveMultipleRecords(
      'new_healthdata',
      `?$filter=new_userid eq '${userId}'&$orderby=new_timestamp desc&$top=100`
    );

    // Get location data
    const locationData = await dataverseClient.retrieveMultipleRecords(
      'new_locationdata',
      `?$filter=new_userid eq '${userId}'&$orderby=new_timestamp desc&$top=100`
    );

    res.json({
      userId,
      healthData: healthData.value || [],
      locationData: locationData.value || [],
      totalEntries: (healthData.value?.length || 0) + (locationData.value?.length || 0)
    });

  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Data validation functions (same as before)
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

// Start server
async function startServer() {
  console.log('🚀 Starting Azure-integrated server...');
  
  // Initialize Dataverse
  const dataverseConnected = await initializeDataverse();
  
  if (dataverseConnected) {
    await createDataverseTables();
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available:`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   GET  /auth/login - Azure AD login`);
    console.log(`   POST /auth/callback - Azure AD callback`);
    console.log(`   POST /api/health-data - Receive health data (authenticated)`);
    console.log(`   POST /api/location-data - Receive location data (authenticated)`);
    console.log(`   GET  /api/user/data - Get user data from Dataverse`);
    console.log(`🔐 Azure AD: ${config.azure.clientId && config.azure.clientId !== 'your-client-id-here' ? 'Configured' : 'Not configured'}`);
    console.log(`💾 Dataverse: ${dataverseConnected ? 'Connected' : 'Not connected'}`);
    console.log(`📋 Configuration:`);
    console.log(`   Azure Client ID: ${config.azure.clientId}`);
    console.log(`   Azure Tenant ID: ${config.azure.tenantId}`);
    console.log(`   Dataverse URL: ${config.dataverse.url}`);
    console.log(`   Environment ID: ${config.dataverse.environmentId}`);
  });
}

startServer().catch(console.error);
