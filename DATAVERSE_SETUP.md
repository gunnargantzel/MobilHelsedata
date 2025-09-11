# 🗄️ Dataverse Setup for Mobil Helsedata

## Oversikt
Denne guiden hjelper deg med å sette opp Microsoft Dataverse for automatisk lagring av helsedata og lokasjonsdata.

## 📋 Steg 1: Opprett Dataverse Environment

1. Gå til [Power Platform Admin Center](https://admin.powerplatform.microsoft.com)
2. Klikk **Environments** i venstre meny
3. Klikk **New environment**
4. Fyll ut:
   - **Name**: `Mobil Helsedata Environment`
   - **Type**: `Production` eller `Sandbox`
   - **Region**: Velg nærmeste region
   - **Create a database for this environment**: ✅ **JA**
5. Klikk **Save**

## 📋 Steg 2: Bruk Eksisterende Entity

Du har allerede en `crd12_testhelsedata` entity med følgende struktur:

**Entity**: `crd12_testhelsedatas`
- **Display name**: TestHelseData
- **Plural name**: TestHelseData
- **Logical name**: crd12_testhelsedata
- **Primary ID**: crd12_testhelsedataid
- **Primary Name**: crd12_id

**Kolonner som brukes:**
- `crd12_data` (Multiple lines of text) - JSON-data med all informasjon
- `crd12_id` (Single line of text) - Primært navn-felt
- `createdon` (Date and time) - Auto-generert når record opprettes
- `modifiedon` (Date and time) - Auto-generert når record oppdateres
- `ownerid` (Lookup) - Auto-generert basert på pålogget bruker
- `statecode` (Choice) - Auto-generert status
- `statuscode` (Choice) - Auto-generert status

**Ingen ytterligere konfigurasjon nødvendig!** 🎉

## 📋 Steg 3: Konfigurer Azure AD App for Dataverse

1. Gå til [Azure Portal](https://portal.azure.com)
2. Naviger til **Azure Active Directory** > **App registrations**
3. Velg din eksisterende "Mobil Helsedata PWA" app
4. Gå til **API permissions**
5. Klikk **Add a permission**
6. Velg **APIs my organization uses**
7. Søk etter: `Dataverse`
8. Velg **Dataverse** (Common Data Service)
9. Velg **Delegated permissions**
10. Legg til: `user_impersonation`
11. Klikk **Grant admin consent**

## 📋 Steg 4: Konfigurasjon Oppdatert ✅

Konfigurasjonen er allerede oppdatert med dine environment-detaljer:

**Environment URL:** `https://gunnarpowerai.api.crm4.dynamics.com`
**Environment ID:** `d28e47b4-ad66-ea3e-b483-d348d5e5b051`
**Organization ID:** `1bc363cc-d887-ef11-ac1e-000d3ab8db5a`

**Ingen ytterligere konfigurasjon nødvendig!** 🎉

## 📋 Steg 5: Test Integrasjonen

1. Start applikasjonen: `npm run dev`
2. Logg inn med Microsoft-konto
3. Samle lokasjonsdata og helsedata
4. Klikk **Del data**
5. Sjekk at data lagres i Dataverse

## 🔧 Feilsøking

### Vanlige problemer:

1. **401 Unauthorized**
   - Sjekk at Azure AD app har riktige permissions
   - Sjekk at admin consent er gitt

2. **404 Not Found**
   - Sjekk at environment URL er riktig
   - Sjekk at entities er opprettet med riktige navn

3. **403 Forbidden**
   - Sjekk at brukeren har tilgang til Dataverse environment
   - Sjekk at Azure AD app har riktige scopes

### Debug tips:

- Åpne Developer Tools (F12)
- Sjekk Network-tabben for API-kall
- Sjekk Console for feilmeldinger
- Test API-kall direkte i Postman eller browser

## 📊 Data Struktur

### Mobil Helsedata Record (crd12_data feltet):
```json
{
  "locationData": {
    "latitude": 59.9139,
    "longitude": 10.7522,
    "accuracy": 10.5,
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "healthData": {
    "selectedTypes": ["heartRate", "steps", "distance"],
    "data": {
      "heartRate": {"value": 72, "unit": "bpm", "timestamp": "2024-01-15T10:30:00Z"},
      "steps": {"value": 8542, "unit": "steps", "timestamp": "2024-01-15T10:30:00Z"}
    },
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "userId": "user@example.com",
  "userInfo": {
    "name": "Bruker Navn",
    "email": "user@example.com"
  },
  "metadata": {
    "appVersion": "1.1.0",
    "collectedAt": "2024-01-15T10:30:00Z",
    "dataTypes": ["heartRate", "steps", "distance"],
    "hasLocation": true,
    "hasHealth": true
  }
}
```

**Auto-genererte felt:**
- `createdon` - Når record ble opprettet
- `modifiedon` - Når record ble sist endret
- `ownerid` - Hvem som eier recordet (pålogget bruker)
- `statecode` - Status (Active/Inactive)
- `statuscode` - Detaljert status

## 🎯 Neste Steg

Etter at Dataverse er satt opp, kan du:

1. **Power BI**: Lage dashboards og rapporter
2. **Power Automate**: Automatisere arbeidsflyter
3. **Power Apps**: Lage administrative apper
4. **Export**: Eksportere data til Excel/CSV
5. **Analytics**: Bruke AI Builder for insights

---

**Støtte**: Hvis du trenger hjelp, sjekk [Microsoft Power Platform dokumentasjon](https://docs.microsoft.com/en-us/power-platform/)
