import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(express.json({ limit: '1mb' }));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'geste-app-backend' });
});

app.post('/payments/:provider', async (req, res) => {
  const provider = req.params.provider;
  if (provider !== 'flooz' && provider !== 'tmoney') {
    res.status(404).json({ message: 'Fournisseur de paiement non supporté.' });
    return;
  }

  const { amount, currency, customer, paymentDetails, orderNumber } = req.body as {
    amount?: number;
    currency?: string;
    customer?: { name?: string; phone?: string; email?: string };
    paymentDetails?: { phoneNumber?: string };
    orderNumber?: string;
  };

  if (!amount || amount <= 0 || !orderNumber) {
    res.status(400).json({ message: 'Montant ou commande invalide.' });
    return;
  }

  const merchantNumber = (process.env.MERCHANT_MOBILE_NUMBER || '91599578').replace(/\D/g, '');
  const providerApiUrl = provider === 'flooz'
    ? process.env.FLOOZ_API_URL
    : process.env.TMONEY_API_URL;
  const providerApiKey = provider === 'flooz'
    ? process.env.FLOOZ_API_KEY
    : process.env.TMONEY_API_KEY;

  if (!providerApiUrl || !providerApiKey) {
    res.status(503).json({
      message: `API ${provider === 'flooz' ? 'Flooz' : 'TMoney'} non configurée sur le backend.`,
      code: 'PAYMENT_PROVIDER_NOT_CONFIGURED'
    });
    return;
  }

  const providerResponse = await fetch(providerApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${providerApiKey}`
    },
    body: JSON.stringify({
      amount,
      currency: currency || 'XOF',
      orderNumber,
      customer,
      payerPhone: paymentDetails?.phoneNumber,
      merchantNumber
    })
  });

  const providerBody = await providerResponse.json().catch(() => ({}));
  if (!providerResponse.ok) {
    res.status(502).json({
      message: `Le fournisseur ${provider === 'flooz' ? 'Flooz' : 'TMoney'} a refusé la demande.`,
      providerResponse: providerBody
    });
    return;
  }

  res.status(200).json({
    ...providerBody,
    provider,
    merchantNumber,
    status: providerBody.status || 'pending'
  });
});

app.post('/orders', (_req, res) => {
  res.status(501).json({
    message: 'Branchez la persistance de la commande (MySQL/PostgreSQL) avant la mise en production.'
  });
});

app.post('/transactions', (_req, res) => {
  res.status(501).json({
    message: 'Branchez la persistance des transactions (MySQL/PostgreSQL) avant la mise en production.'
  });
});

app.patch('/transactions/:id', (_req, res) => {
  res.status(501).json({
    message: 'Branchez la persistance des transactions (MySQL/PostgreSQL) avant la mise en production.'
  });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Erreur interne du serveur de paiement.' });
});

app.listen(port, () => {
  console.log(`GESTE APP backend listening on http://localhost:${port}`);
});
