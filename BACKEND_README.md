# Backend API for Mobil Helsedata

Denne backend-serveren mottar og lagrer helsedata og lokasjonsdata fra PWA-appen.

## 🚀 Starte serveren

```bash
# Installer avhengigheter
npm install

# Start backend-server
npm start
# eller
node server.js
```

Serveren kjører på `http://localhost:3000`

## 📡 API Endepunkter

### Health Check
```
GET /api/health
```
Returnerer server-status og versjon.

### Mottak av helsedata
```
POST /api/health-data
Content-Type: application/json

{
  "userId": "user_123",
  "healthData": {
    "selectedTypes": ["heartRate", "steps"],
    "lastUpdated": "2024-01-15T10:30:00Z",
    "data": {
      "heartRate": {"value": 72, "unit": "bpm"},
      "steps": {"value": 8542, "unit": "steps"}
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Mottak av lokasjonsdata
```
POST /api/location-data
Content-Type: application/json

{
  "userId": "user_123",
  "locationData": {
    "latitude": 59.9139,
    "longitude": 10.7522,
    "accuracy": 10,
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Mottak av kombinert data
```
POST /api/combined-data
Content-Type: application/json

{
  "userId": "user_123",
  "locationData": { ... },
  "healthData": { ... },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Dataoversikt
```
GET /api/data-summary
```
Returnerer statistikk over mottatte data.

### Brukerdata
```
GET /api/user/:userId/data
```
Returnerer all data for en spesifikk bruker.

## 💾 Datalagring

Data lagres i JSON-filer i `data/`-mappen:
- `health_data.json` - Helsedata
- `location_data.json` - Lokasjonsdata
- `users.json` - Brukerinformasjon

## 🔒 Datavalidering

Serveren validerer:
- **Helsedata**: Påkrevde felter og gyldige datatyper
- **Lokasjonsdata**: Koordinater innenfor gyldige områder
- **Bruker-ID**: Unik identifikator for hver bruker

## 📊 Dashboard

Åpne `dashboard.html` i nettleseren for å se:
- Statistikk over mottatte data
- Siste innlegg
- Brukeroversikt

## 🛠️ Utvikling

### Lokal testing
1. Start backend: `npm start`
2. Åpne PWA: `http://localhost:3000`
3. Åpne dashboard: `http://localhost:3000/dashboard.html`

### Produksjon
Backend-serveren kan deployes til:
- Heroku
- Railway
- DigitalOcean
- Azure App Service
- AWS EC2

## 🔧 Konfigurasjon

Miljøvariabler:
- `PORT` - Server-port (standard: 3000)
- `NODE_ENV` - Miljø (development/production)

## 📝 Logging

Serveren logger:
- Mottatte data-innlegg
- Feil og valideringsfeil
- API-forespørsler

## 🚨 Sikkerhet

**Viktig**: Dette er en demonstrasjonsversjon. For produksjon:
- Legg til autentisering
- Implementer HTTPS
- Valider alle inputs grundig
- Bruk en ekte database
- Legg til rate limiting
- Implementer logging og monitoring
