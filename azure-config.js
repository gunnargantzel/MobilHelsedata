// Azure Configuration for Mobil Helsedata
// Tenant ID: 647bb407-d412-4d48-b7bf-367c871cfca6

module.exports = {
  // Azure AD Configuration
  azure: {
    clientId: 'your-client-id-here', // Replace with your App Registration Client ID
    clientSecret: 'your-client-secret-here', // Replace with your App Registration Secret
    tenantId: '647bb407-d412-4d48-b7bf-367c871cfca6', // Your Tenant ID
    redirectUri: 'http://localhost:3000/auth/callback',
    scopes: ['User.Read', 'openid', 'profile', 'email']
  },

  // Dataverse Configuration
  dataverse: {
    url: 'https://your-org.crm.dynamics.com', // Replace with your Dataverse URL
    clientId: 'your-dataverse-client-id', // Replace with your Dataverse App Registration Client ID
    clientSecret: 'your-dataverse-client-secret', // Replace with your Dataverse App Registration Secret
    apiVersion: '9.2'
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    sessionSecret: 'mobil-helsedata-session-secret-2024', // Change this in production
    jwtSecret: 'mobil-helsedata-jwt-secret-2024' // Change this in production
  }
};
