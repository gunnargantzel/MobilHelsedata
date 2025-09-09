# Mobil Helsedata PWA

En Progressive Web App (PWA) som lar brukere samle og dele helsedata og lokasjonsdata på en sikker måte.

## Funksjoner

- 📱 **PWA-støtte**: Kan installeres på iPhone som en native app
- 📍 **Lokasjonsdata**: Samler inn brukerens lokasjon med samtykke
- ❤️ **Apple Health-integrasjon**: Lar brukere velge hvilke helsedata som skal deles
- 🔒 **Sikkerhet**: Brukeren har full kontroll over hvilke data som samles inn
- 📊 **Dataoversikt**: Viser samlet data før deling
- 🎨 **Moderne UI**: Responsivt design optimalisert for mobil

## Teknisk oversikt

### Arkitektur
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **PWA**: Service Worker for offline-funksjonalitet
- **Manifest**: App-konfigurasjon for installasjon
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
4. Start en lokal web-server (f.eks. med Python: `python -m http.server 8000`)
5. Åpne appen i Safari på iPhone

### For brukere
1. Åpne appen i Safari på iPhone
2. Trykk "Del"-knappen og velg "Legg til på hjemmeskjerm"
3. Appen installeres som en native app

## Datasamling

### Lokasjonsdata
- Brukeren må eksplisitt gi tillatelse
- Samler inn: breddegrad, lengdegrad, nøyaktighet, tidsstempel
- Data lagres lokalt og deles kun når brukeren velger det

### Apple Health-data
Brukeren kan velge mellom:
- **Hjerte og sirkulasjon**: Hjerteslag, blodtrykk, hvilende hjerteslag
- **Aktivitet**: Skritt, distanse, aktiv energi, trenings tid
- **Søvn**: Søvnanalyse, leggetid
- **Kroppsmål**: Vekt, høyde, BMI

## Sikkerhet og personvern

- Alle tillatelser krever eksplisitt bruker-samtykke
- Data lagres kun lokalt på enheten
- Ingen data sendes til eksterne servere uten brukerens eksplisitte tillatelse
- Brukeren kan når som helst endre eller trekke tilbake tillatelser

## Browser-støtte

- **iOS Safari**: Full støtte for PWA-installasjon
- **Chrome**: Full støtte
- **Firefox**: Full støtte
- **Edge**: Full støtte

## Utvikling

### Lokal utvikling
```bash
# Start lokal server
python -m http.server 8000

# Eller med Node.js
npx serve .

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
- [ ] Push-notifikasjoner for dataoppdateringer
- [ ] Offline-datavisualisering
- [ ] Flerspråk-støtte
- [ ] Avanserte sikkerhetsfunksjoner

## Lisens

Dette prosjektet er utviklet for demonstrasjonsformål. Se til lokal lovgivning før bruk i produksjon.

## Kontakt

For spørsmål eller bidrag, vennligst opprett en issue i prosjektet.
