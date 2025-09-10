# Mobil Helsedata PWA

En ren Progressive Web App (PWA) som lar brukere samle helsedata og lokasjonsdata lokalt på enheten sin.

## Funksjoner

- 📱 **PWA-støtte**: Kan installeres på iPhone som en native app
- 📍 **Lokasjonsdata**: Samler inn brukerens lokasjon med samtykke
- ❤️ **Apple Health-integrasjon**: Lar brukere velge hvilke helsedata som skal samles inn
- 🔒 **Lokal lagring**: Alle data lagres kun lokalt på enheten
- 📊 **Dataoversikt**: Viser samlet data og statistikk
- 🎨 **Moderne UI**: Responsivt design optimalisert for mobil
- 🌐 **Offline-funksjonalitet**: Fungerer uten internett-tilkobling

## Teknisk oversikt

### Arkitektur
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **PWA**: Service Worker for offline-funksjonalitet og caching
- **Manifest**: App-konfigurasjon for installasjon
- **Lokal lagring**: Browser LocalStorage og IndexedDB
- **Responsivt design**: Optimalisert for iPhone og andre mobile enheter

### Filer
- `index.html` - Hovedapplikasjon
- `manifest.json` - PWA-konfigurasjon
- `sw.js` - Service Worker for caching og offline-støtte
- `styles.css` - Styling og responsivt design
- `app.js` - JavaScript-funksjonalitet
- `icons/` - App-ikoner i forskjellige størrelser

## Installasjon og bruk

### For utviklere
1. Klon eller last ned prosjektet
2. Åpne `create-icons.html` i en nettleser for å generere ikoner
3. Last ned alle ikoner til `icons/`-mappen
4. Start en lokal web-server:
   ```bash
   # Med Node.js (anbefalt)
   npm install
   npm run serve
   
   # Eller med Python
   python -m http.server 8000
   
   # Eller med PHP
   php -S localhost:8000
   ```
5. Åpne appen i Safari på iPhone

### For brukere
1. Åpne appen i Safari på iPhone
2. Trykk "Del"-knappen og velg "Legg til på hjemmeskjerm"
3. Appen installeres som en native app

## Datasamling

### Lokasjonsdata
- Brukeren må eksplisitt gi tillatelse
- Samler inn: breddegrad, lengdegrad, nøyaktighet, tidsstempel
- Data lagres kun lokalt på enheten

### Apple Health-data
Brukeren kan velge mellom:
- **Hjerte og sirkulasjon**: Hjerteslag, blodtrykk, hvilende hjerteslag
- **Aktivitet**: Skritt, distanse, aktiv energi, trenings tid
- **Søvn**: Søvnanalyse, leggetid
- **Kroppsmål**: Vekt, høyde, BMI

### Datalagring
- Alle data lagres lokalt i browserens LocalStorage
- Ingen data sendes til eksterne servere
- Brukeren har full kontroll over sine data

## Sikkerhet og personvern

- Alle tillatelser krever eksplisitt bruker-samtykke
- Data lagres kun lokalt på enheten
- Ingen data sendes til eksterne servere
- Ingen tracking eller analytics
- Brukeren kan når som helst endre eller trekke tilbake tillatelser
- Data kan slettes når som helst fra appen

## Browser-støtte

- **iOS Safari**: Full støtte for PWA-installasjon
- **Chrome**: Full støtte
- **Firefox**: Full støtte
- **Edge**: Full støtte

## Utvikling

### Lokal utvikling
```bash
# Installer avhengigheter (kun for utvikling)
npm install

# Start lokal server
npm run serve

# Eller med Python
python -m http.server 8000

# Eller med PHP
php -S localhost:8000
```

### Testing på iPhone
1. Sørg for at iPhone og utviklingsmaskin er på samme nettverk
2. Start lokal server på utviklingsmaskinen
3. Åpne `http://[UTVIKLINGSIP]:8000` i Safari på iPhone
4. Test PWA-installasjon og funksjonalitet

## Fremtidige forbedringer

- [ ] Ekte Apple HealthKit-integrasjon
- [ ] Dataeksport til forskjellige formater (JSON, CSV)
- [ ] Avanserte datavisualiseringer og grafer
- [ ] Flerspråk-støtte
- [ ] Data-synkronisering mellom enheter (valgfritt)
- [ ] Automatisk backup til iCloud (valgfritt)

## Lisens

Dette prosjektet er utviklet for demonstrasjonsformål. Se til lokal lovgivning før bruk i produksjon.

## Kontakt

For spørsmål eller bidrag, vennligst opprett en issue i prosjektet.
