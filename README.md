<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/8a6ce2e0-f735-4c65-b89a-28c9e0a36895

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Paiements et MySQL

Le checkout utilise `PaymentGatewayFactory` pour Flooz, TMoney et Stripe en mode mock.
Il enregistre toujours la transaction avant de confirmer la commande. Pour brancher
un backend MySQL, définissez `VITE_API_URL` dans `.env.local`. Le backend doit exposer :

- `POST /transactions` pour créer la transaction ;
- `PATCH /transactions/:id` pour l’associer à la commande créée.
- `POST /orders` pour confirmer la commande après l’enregistrement de la transaction.

Le serveur doit refuser toute commande dont `transactionId` ne correspond pas à une
transaction enregistrée avec succès. Cette séparation permet de conserver une
contrainte MySQL claire : transaction d’abord, commande ensuite.

Sans `VITE_API_URL`, l’application utilise le stockage local uniquement pour le mode démo.

## Frontend et backend séparés

Lancer le frontend :

```bash
npm run dev
```

Lancer le backend dans un autre terminal :

```bash
npm run dev:backend
```

Le frontend utilise `VITE_API_URL=http://localhost:4000` pour appeler le backend.
Le backend expose `GET /health` et les routes de paiement `POST /payments/flooz`
et `POST /payments/tmoney`.

## Configuration Flooz et TMoney

Les clés et secrets Flooz/TMoney ne doivent jamais être ajoutés dans le frontend
React ni dans une variable `VITE_*`, car ces valeurs sont visibles dans le navigateur.
Ils doivent être configurés sur un backend sécurisé, par exemple dans les variables
d’environnement du serveur :

```env
FLOOZ_API_URL=https://...
FLOOZ_API_KEY=...
FLOOZ_MERCHANT_ID=...
TMONEY_API_URL=https://...
TMONEY_API_KEY=...
TMONEY_MERCHANT_ID=...
```

Le frontend utilise uniquement `VITE_API_URL` pour appeler ce backend. Les routes
recommandées sont `POST /payments/flooz`, `POST /payments/tmoney` et
`GET /payments/:provider/:transactionId`. Le backend doit vérifier le montant,
le numéro marchand `91599578`, la signature de l’opérateur et le statut réel
avant de confirmer une commande.
