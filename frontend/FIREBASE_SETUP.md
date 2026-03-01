# Firebase setup for sign-in / sign-up

The error **"auth/api-key-not-valid"** means the app is still using placeholder Firebase config. Do the following.

## 1. Create a Firebase project (if you don’t have one)

1. Open [Firebase Console](https://console.firebase.google.com).
2. Click **Add project** (or use an existing project).
3. Follow the steps (name, optional Analytics, etc.).

## 2. Add a Web app and get the config

1. In the project, go to **Project settings** (gear icon) → **General**.
2. Under **Your apps**, click the **Web** icon (`</>`) to add a Web app.
3. Give it a nickname (e.g. "IntelliFolio") and click **Register app**.
4. You’ll see a **firebaseConfig** object. Copy the values from it.

## 3. Enable Email/Password and Google sign-in

1. In the left sidebar, go to **Build** → **Authentication**.
2. Click **Get started** if prompted.
3. Open the **Sign-in method** tab.
4. Enable **Email/Password** (and optionally **Google** if you use “Continue with Google”).

## 4. Put the config in `.env.local`

In the **frontend** folder, edit `frontend/.env.local` and replace the placeholders with the values from step 2:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_FIREBASE_API_KEY=AIza...          # from firebaseConfig.apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myapp.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 5. Restart the frontend

Stop the dev server (Ctrl+C) and run:

```bash
npm run dev
```

Then try **Create Account** or **Sign in** again.
