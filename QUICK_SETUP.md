# 🚀 Rask Setup for Mobil Helsedata

## Din Tenant ID: `647bb407-d412-4d48-b7bf-367c871cfca6`

### 📋 Steg 1: Azure AD App Registration

1. Gå til [Azure Portal](https://portal.azure.com)
2. Naviger til **Azure Active Directory** > **App registrations**
3. Klikk **New registration**
4. Fyll ut:
   - **Name**: `Mobil Helsedata PWA`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: `Web` - `http://localhost:3000/auth/callback`
5. Klikk **Register**

### 📋 Steg 2: Hent Client ID og Secret

1. **Kopier Client ID** fra Overview-siden
2. Gå til **Certificates & secrets**
3. Klikk **New client secret**
4. Beskrivelse: `Mobil Helsedata Secret`
5. Expires: `24 months`
6. **Kopier Secret-verdien** (kun vist én gang!)

### 📋 Steg 3: Konfigurer API Permissions

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

### 📋 Steg 4: Oppdater Konfigurasjon

Rediger `azure-config.js` og erstatt:

```javascript
azure: {
  clientId: 'DIN-CLIENT-ID-HER', // Fra steg 2
  clientSecret: 'DIN-CLIENT-SECRET-HER', // Fra steg 2
  tenantId: '647bb407-d412-4d48-b7bf-367c871cfca6', // Din tenant ID
  redirectUri: 'http://localhost:3000/auth/callback',
  scopes: ['User.Read', 'openid', 'profile', 'email']
}
```

### 📋 Steg 5: Start Applikasjonen

```bash
# Installer avhengigheter
npm install

# Start serveren
node azure-server.js
```

### 📋 Steg 6: Test

1. Åpne `http://localhost:3000`
2. Klikk **Logg inn med Microsoft**
3. Logg inn med din Azure AD-bruker
4. Test data-samling og deling

## 🔧 Dataverse Setup (Valgfritt)

Hvis du vil bruke Dataverse for datalagring:

1. Følg `AZURE_SETUP.md` for Dataverse-konfigurasjon
2. Oppdater `dataverse`-seksjonen i `azure-config.js`
3. Opprett custom tables i Power Apps

## ✅ Ferdig!

Din app er nå konfigurert med Azure AD-autentisering og klar til bruk!
