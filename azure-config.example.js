// Azure Configuration Example
// Copy this file to azure-config.js and fill in your actual values

module.exports = {
  // Azure AD Configuration
  azure: {
    clientId: 'your-client-id-here',
    clientSecret: 'your-client-secret-here',
    tenantId: 'your-tenant-id-here',
    redirectUri: 'http://localhost:3000/auth/callback',
    scopes: ['User.Read', 'openid', 'profile', 'email']
  },

  // Dataverse Configuration
  dataverse: {
    url: 'https://your-org.crm.dynamics.com',
    clientId: 'your-dataverse-client-id',
    clientSecret: 'your-dataverse-client-secret',
    apiVersion: '9.2'
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    sessionSecret: 'your-session-secret-here',
    jwtSecret: 'your-jwt-secret-here'
  }
};
