// Azure Configuration for Mobil Helsedata
// Tenant ID: 647bb407-d412-4d48-b7bf-367c871cfca6

module.exports = {
  // Azure AD Configuration
  azure: {
    clientId: '7a0a3c1e-6465-41bf-901f-2b1850335c32', // Your App Registration Client ID
    clientSecret: process.env.AZURE_CLIENT_SECRET || 'your-client-secret-here', // Replace with your App Registration Secret
    tenantId: '647bb407-d412-4d48-b7bf-367c871cfca6', // Your Tenant ID
    redirectUri: 'http://localhost:3000/auth/callback',
    scopes: ['User.Read', 'openid', 'profile', 'email']
  },

  // Dataverse Configuration
  dataverse: {
    url: 'https://gunnarnorge.api.crm19.dynamics.com/api/data/v9.2', // Your Dataverse Web API endpoint
    environmentId: 'ad5555a3-7b7e-e024-9433-b5f368c2a754', // Your Environment ID
    organizationId: 'b9d5dafe-013e-ef11-8e4c-0022486f2174', // Your Organization ID
    clientId: process.env.DATAVERSE_CLIENT_ID || 'your-dataverse-client-id', // Replace with your Dataverse App Registration Client ID
    clientSecret: process.env.DATAVERSE_CLIENT_SECRET || 'your-dataverse-client-secret', // Replace with your Dataverse App Registration Secret
    apiVersion: '9.2'
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    sessionSecret: process.env.SESSION_SECRET || 'mobil-helsedata-session-secret-2024', // Change this in production
    jwtSecret: process.env.JWT_SECRET || 'mobil-helsedata-jwt-secret-2024' // Change this in production
  }
};
