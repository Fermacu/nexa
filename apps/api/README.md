# NEXA API

Express.js backend API for the NEXA platform with Firebase integration.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:** Copy `.env.example` to `.env` and fill in your Firebase credentials.

3. **Firebase credentials:** Project Settings → Service Accounts → Generate New Private Key. Map:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep quotes and `\n`)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

4. **Run the server:**
   ```bash
   npm run dev
   ```

5. **Health check:** `GET http://localhost:3001/health`

## Auth endpoints

- **POST /api/auth/register** — Register user only. Body: `{ user: { name, email, password, phone? } }`
  - Users can create organizations later from their profile page

## Company endpoints

- **POST /api/companies** — Create a new company (requires authentication). Body: `{ name, email, phone, address: { street, city, state, postalCode, country }, website?, industry?, description? }`
  - Creates a company and automatically adds the authenticated user as admin
- **GET /api/companies/:id** — Get company by ID (requires authentication)
- **PUT /api/companies/:id** — Update company information (requires authentication, admin only)

## Testing from the frontend

1. Start the API: `cd apps/api && npm run dev`
2. In the web app, set `NEXT_PUBLIC_API_URL=http://localhost:3001` in `.env.local`
3. Add Firebase **client** config in `.env.local` (Project Settings → General → Your apps):  
   `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, etc.
4. Start the web app: `cd apps/web && npm run dev`
5. Open http://localhost:3000/auth — use "Crear cuenta" to register (hits the API and then signs in with Firebase). After registration, users can create organizations from their profile page.

CORS is set to `http://localhost:3000` by default via `CORS_ORIGIN` in the API `.env`.

## Firestore: los datos no aparecen

Si el registro funciona (creas cuenta e inicias sesión) pero no ves usuarios/empresas en Firestore:

1. **Activar Firestore**  
   Firebase Console → **Build** → **Firestore Database** → **Create database** (elige modo “Production” o “Test” y una región). Sin esto, las escrituras pueden fallar o no persistir.

2. **Mismo proyecto**  
   En la consola, comprueba que estás en el proyecto cuyo **Project ID** coincide con `FIREBASE_PROJECT_ID` en tu `.env`.

3. **Ver Firestore, no Realtime Database**  
   Los datos del API se guardan en **Firestore Database** (Build → Firestore Database). No confundir con “Realtime Database”.

4. **Colecciones que crea el registro**  
   Tras un registro correcto deberías ver:
   - `users` (documento con id = uid del usuario)
   
   Las organizaciones se crean desde el perfil del usuario y crean:
   - `companies` (documento con id autogenerado)
   - `memberships` (documento con userId, companyId, role, joinedAt)

5. **Si el API devuelve error al registrar**  
   Revisa la consola del servidor (donde corre `npm run dev`). Ahí se muestra el error concreto de Firestore (por ejemplo permisos o base de datos no creada).
