# EduTrack Backend Laravel

Backend API Laravel pour l'application EduTrack.

## Installation WampServer

1. Demarrer WampServer et ouvrir phpMyAdmin.
2. Importer le fichier `database/edutrack.sql`.
3. Dans ce dossier `backend`, installer les dependances:

```powershell
composer install
```

4. Creer le fichier `.env` depuis `.env.example`, puis generer la cle:

```powershell
copy .env.example .env
php artisan key:generate
```

5. Verifier les valeurs MySQL dans `.env`:

```env
DB_DATABASE=edutrack
DB_USERNAME=root
DB_PASSWORD=
```

6. Lancer l'API:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

Le front appelle par defaut `http://127.0.0.1:8000/api`.

## Notifications

Les cles Twilio et Resend ne sont plus dans le navigateur. Les renseigner dans `.env`:

```env
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=
RESEND_API_KEY=
MAIL_FROM_ADDRESS=onboarding@resend.dev
MAIL_FROM_NAME=EduTrack
```

Si les cles sont vides, les presences et notes sont bien enregistrees, mais l'API indique que la notification a ete ignoree.

## Routes API

- `GET /api/health`
- `GET /api/eleves`
- `GET /api/analyses`
- `GET /api/presences`
- `POST /api/presences`
- `GET /api/notes`
- `POST /api/notes`

Exemple presence:

```json
{
  "eleve_id": 1,
  "statut": "A"
}
```

Exemple note:

```json
{
  "eleve_id": 1,
  "type": "Interro",
  "valeur": 12.5
}
```

## Alternative sans SQL manuel

Au lieu d'importer `database/edutrack.sql`, il est possible de creer la base `edutrack`, puis lancer:

```powershell
php artisan migrate --seed
```

pour lancer le serveur
cd C:\Users\HP\Desktop\eductrack\backend
& "C:\wamp64\bin\php\php8.2.13\php.exe" -S 127.0.0.1:8000 -t public



pour lancer le front
cd C:\Users\HP\Desktop\eductrack
& "C:\wamp64\bin\php\php8.2.13\php.exe" -S 127.0.0.1:3000