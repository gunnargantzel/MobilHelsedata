# Azure AD og Dataverse Setup Guide

Denne guiden viser deg hvordan du setter opp Azure AD-autentisering og Dataverse-integrasjon for Mobil Helsedata-appen.

## 🔧 Forutsetninger

- Azure-abonnement med admin-tilgang
- Power Platform-licens (for Dataverse)
- Node.js installert lokalt

## 📋 Steg 1: Azure AD App Registration

### 1.1 Opprett App Registration

1. Gå til [Azure Portal](https://portal.azure.com)
2. Naviger til **Azure Active Directory** > **App registrations**
3. Klikk **New registration**
4. Fyll ut:
   - **Name**: `Mobil Helsedata PWA`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: `Web` - `http://localhost:3000/auth/callback`
5. Klikk **Register**

### 1.2 Konfigurer App Registration

1. **Noter ned**:
   - `Application (client) ID`
   - `Directory (tenant) ID`

2. Gå til **Certificates & secrets**
3. Klikk **New client secret**
4. Beskrivelse: `Mobil Helsedata Secret`
5. Expires: `24 months`
6. Klikk **Add**
7. **Kopier og lagre** secret-verdien

### 1.3 Konfigurer API Permissions

1. Gå til **API permissions**
2. Klikk **Add a permission**
3. Velg **Microsoft Graph**
4. Velg **Delegated permissions**
5. Legg til:
   - `User.Read`
   - `openid`
   - `profile`
   - `email`
6. Klikk **Grant admin consent**

## 📋 Steg 2: Dataverse Setup

### 2.1 Opprett Power Platform Environment

1. Gå til [Power Platform Admin Center](https://admin.powerplatform.microsoft.com)
2. Klikk **Environments**
3. Klikk **New environment**
4. Fyll ut:
   - **Name**: `Mobil Helsedata Environment`
   - **Type**: `Production`
   - **Region**: Velg nærmeste region
5. Klikk **Save**

### 2.2 Opprett App Registration for Dataverse

1. Gå tilbake til Azure Portal > **App registrations**
2. Klikk **New registration**
3. Fyll ut:
   - **Name**: `Mobil Helsedata Dataverse`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: `Web` - `https://your-org.crm.dynamics.com`
4. Klikk **Register**

### 2.3 Konfigurer Dataverse Permissions

1. **Noter ned**:
   - `Application (client) ID`
   - `Directory (tenant) ID`

2. Gå til **Certificates & secrets**
3. Opprett ny client secret (samme prosess som over)

4. Gå til **API permissions**
5. Klikk **Add a permission**
6. Velg **Dynamics CRM**
7. Velg **Delegated permissions**
8. Legg til:
   - `user_impersonation`
9. Klikk **Grant admin consent**

### 2.4 Opprett Custom Tables i Dataverse

1. Gå til [Power Apps](https://make.powerapps.com)
2. Velg ditt environment
3. Gå til **Tables** i venstre meny
4. Klikk **New table**

#### HealthData Table:
- **Display name**: `Health Data`
- **Plural name**: `Health Data`
- **Schema name**: `new_healthdata`

**Columns**:
- `new_userid` (Text, 100 chars, Required)
- `new_datatype` (Text, 50 chars, Required)
- `new_datavalue` (Text, 1000 chars)
- `new_timestamp` (Date and Time, Required)

#### LocationData Table:
- **Display name**: `Location Data`
- **Plural name**: `Location Data`
- **Schema name**: `new_locationdata`

**Columns**:
- `new_userid` (Text, 100 chars, Required)
- `new_latitude` (Decimal, 10 precision, Required)
- `new_longitude` (Decimal, 10 precision, Required)
- `new_accuracy` (Decimal, 5 precision)
- `new_timestamp` (Date and Time, Required)

## 📋 Steg 3: Konfigurer Applikasjonen

### 3.1 Opprett Konfigurasjonsfil

1. Kopier `azure-config.example.js` til `azure-config.js`
2. Fyll ut verdiene:

```javascript
module.exports = {
  azure: {
    clientId: 'your-azure-ad-client-id',
    clientSecret: 'your-azure-ad-client-secret',
    tenantId: 'your-tenant-id',
    redirectUri: 'http://localhost:3000/auth/callback',
    scopes: ['User.Read', 'openid', 'profile', 'email']
  },
  dataverse: {
    url: 'https://your-org.crm.dynamics.com',
    clientId: 'your-dataverse-client-id',
    clientSecret: 'your-dataverse-client-secret',
    apiVersion: '9.2'
  },
  server: {
    port: 3000,
    sessionSecret: 'your-random-session-secret',
    jwtSecret: 'your-random-jwt-secret'
  }
};
```

### 3.2 Installer Avhengigheter

```bash
npm install
```

### 3.3 Start Serveren

```bash
# Start Azure-integrated server
node azure-server.js

# Eller bruk npm script
npm run dev:backend
```

## 🧪 Testing

### 3.1 Test Azure AD Login

1. Åpne `http://localhost:3000`
2. Klikk **Logg inn med Microsoft**
3. Logg inn med din Azure AD-bruker
4. Verifiser at du blir logget inn

### 3.2 Test Data Collection

1. Gi tillatelser for lokasjon og helsedata
2. Velg helsedata-typer
3. Klikk **Del data**
4. Verifiser at data lagres i Dataverse

### 3.3 Verifiser i Dataverse

1. Gå til Power Apps
2. Velg ditt environment
3. Gå til **Tables** > **Health Data** eller **Location Data**
4. Verifiser at data er lagret

## 🚀 Produksjon Deployment

### Azure App Service

1. Opprett Azure App Service
2. Konfigurer environment variables:
   - `AZURE_CLIENT_ID`
   - `AZURE_CLIENT_SECRET`
   - `AZURE_TENANT_ID`
   - `DATAVERSE_URL`
   - `DATAVERSE_CLIENT_ID`
   - `DATAVERSE_CLIENT_SECRET`
   - `SESSION_SECRET`
   - `JWT_SECRET`

3. Deploy koden til App Service

### Oppdater Redirect URIs

I Azure Portal, legg til produksjon URL-er:
- `https://your-app.azurewebsites.net/auth/callback`

## 🔒 Sikkerhet

### Produksjon Checklist

- [ ] HTTPS aktivert
- [ ] Environment variables sikret
- [ ] Client secrets rotert regelmessig
- [ ] Admin consent gitt for alle permissions
- [ ] Rate limiting implementert
- [ ] Logging og monitoring aktivert
- [ ] Backup-strategi for Dataverse-data

## 🆘 Feilsøking

### Vanlige Problemer

1. **"Invalid client"**: Sjekk client ID og secret
2. **"Insufficient privileges"**: Sjekk API permissions og admin consent
3. **"Dataverse connection failed"**: Sjekk URL og credentials
4. **"Token expired"**: Implementer token refresh

### Debug Tips

1. Aktiver detaljert logging i `azure-server.js`
2. Sjekk browser console for feil
3. Verifiser network requests i Developer Tools
4. Test API-endepunkter direkte med Postman

## 📞 Support

For spørsmål eller problemer:
1. Sjekk Azure AD-dokumentasjon
2. Sjekk Dataverse-dokumentasjon
3. Opprett issue i GitHub-repositoryet
