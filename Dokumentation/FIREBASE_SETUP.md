# Firebase Setup Guide - Fordonsbok

## Steg 1: Skapa Firebase-projekt

1. Gå till [Firebase Console](https://console.firebase.google.com/)
2. Klicka på "Add project" eller "Lägg till projekt"
3. Ge projektet ett namn (t.ex. "Fordonsbok")
4. Följ stegen och klicka "Create project"

## Steg 2: Aktivera Authentication

1. I Firebase Console, gå till vänstermenyn och klicka på "Authentication"
2. Klicka på "Get started"
3. Under "Sign-in method", klicka på "Email/Password"
4. Aktivera "Email/Password" (första switchen)
5. Klicka "Save"

## Steg 3: Skapa Firestore Database

1. I vänstermenyn, klicka på "Firestore Database"
2. Klicka "Create database"
3. Välj "Start in production mode" (vi ändrar reglerna sen)
4. Välj en location (välj "europe-west1" för bäst prestanda i Sverige)
5. Klicka "Enable"

## Steg 4: Konfigurera Firestore Rules

1. I Firestore Database, klicka på fliken "Rules"
2. Ersätt innehållet med följande:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own vehicles
    match /vehicles/{vehicleId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Klicka "Publish"

## Steg 5: Hämta Firebase Config

1. I Firebase Console, klicka på kugghjulet (⚙️) bredvid "Project Overview"
2. Välj "Project settings"
3. Scrolla ner till "Your apps"
4. Klicka på "</>" (Web app) ikonen
5. Ge appen ett namn (t.ex. "Fordonsbok Web")
6. AVMARKERA "Also set up Firebase Hosting" (behövs inte)
7. Klicka "Register app"
8. Kopiera konfigurationsobjektet (const firebaseConfig = {...})

## Steg 6: Uppdatera HTML-filen

1. Öppna `vehicle-service-book-firebase.html`
2. Hitta raden som säger:
   ```javascript
   const firebaseConfig = {
       apiKey: "DIN_API_KEY",
       ...
   ```
3. Ersätt hela firebaseConfig-objektet med det du kopierade från Firebase Console
4. Spara filen

## Steg 7: Testa appen

1. Öppna `vehicle-service-book-firebase.html` i din webbläsare
2. Klicka på "Registrera" fliken
3. Skapa ett konto med din email och ett lösenord (minst 6 tecken)
4. Du borde nu vara inloggad och kunna lägga till fordon!

## Exempel på Firebase Config

Din Firebase config ska se ut ungefär såhär (med dina egna värden):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  authDomain: "fordonsbok-12345.firebaseapp.com",
  projectId: "fordonsbok-12345",
  storageBucket: "fordonsbok-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

## Hosting (Valfritt)

Om du vill göra appen tillgänglig online:

### Alternativ A: Firebase Hosting (Rekommenderat - Gratis)

1. Installera Firebase CLI: `npm install -g firebase-tools`
2. Logga in: `firebase login`
3. I projektmappen: `firebase init hosting`
4. Välj ditt Firebase-projekt
5. Sätt public directory till `.` (nuvarande mapp)
6. Välj "No" för single-page app
7. Kopiera din HTML-fil till projektmappen
8. Deploy: `firebase deploy --only hosting`

### Alternativ B: Netlify (Enklast)

1. Gå till [Netlify](https://www.netlify.com/)
2. Dra och släpp din HTML-fil på deras drop zone
3. Din app är live!

### Alternativ C: GitHub Pages

1. Skapa ett GitHub repository
2. Ladda upp din HTML-fil
3. Gå till Settings > Pages
4. Välj "main" branch som source
5. Din app blir tillgänglig på `username.github.io/repo-name`

## Säkerhet & Best Practices

✅ **Firestore Rules är aktiverade** - Användare kan bara se sina egna fordon
✅ **Email/Password authentication** - Säker inloggning
✅ **API-nycklar i koden är OK** - Firebase API-nycklar är säkra att exponera (skyddas av Firestore Rules)

## Vanliga problem

**Problem:** "Permission denied" när jag försöker lägga till fordon
**Lösning:** Kontrollera att Firestore Rules är korrekt uppsatta (Steg 4)

**Problem:** "Firebase: Error (auth/invalid-api-key)"
**Lösning:** Dubbelkolla att du kopierat rätt API-nyckel från Firebase Console

**Problem:** Appen laddar inte
**Lösning:** Öppna Developer Console (F12) och kolla efter felmeddelanden

## Support

Om du stöter på problem:
1. Kolla Firebase Console under "Authentication" och "Firestore Database" för att se om data sparas
2. Öppna Developer Console i webbläsaren (F12) för att se felmeddelanden
3. Kontrollera att alla steg ovan är gjorda korrekt

## Gratis tier-begränsningar

Firebase Free (Spark) plan inkluderar:
- ✅ 50,000 document reads/dag
- ✅ 20,000 document writes/dag
- ✅ 10 GB hosting/månad
- ✅ Unlimited users

Detta räcker gott för personlig användning och flera användare!
