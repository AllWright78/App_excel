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
