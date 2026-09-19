import { PaymentGateway, PaymentRequest, PaymentResult } from './types';

/**
 * Stripe Payment Gateway Implementation
 * Handles Credit/Debit Card payments (Visa, Mastercard, Amex, UnionPay)
 */
export class StripePaymentGateway implements PaymentGateway {
  readonly providerName = 'Stripe (Cartes Bancaires)';

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    const { cardNumber, cardExp, cardCvc, cardHolder } = request.paymentDetails;
    const cleanCard = (cardNumber || '').replace(/[\s\-]/g, '');

    // Basic card validation check
    if (cleanCard && cleanCard.length < 12) {
      return {
        success: false,
        transactionId: `tx-str-fail-${Date.now()}`,
        transactionReference: `STR-ERR-${Date.now()}`,
        provider: 'stripe',
        amount: request.amount,
        currency: request.currency,
        status: 'failed',
        message: 'Numéro de carte bancaire invalide ou incomplet.',
        timestamp: new Date().toISOString(),
        gatewayResponse: {
          error: {
            type: 'card_error',
            code: 'invalid_number',
            message: 'Your card number is invalid.'
          }
        }
      };
    }

    // Simulate Stripe 3D Secure and PaymentIntent processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const timestamp = new Date().toISOString();
    const paymentIntentId = `pi_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    const chargeId = `ch_${Math.random().toString(36).substring(2, 12)}`;
    const last4 = cleanCard ? cleanCard.slice(-4) : '4242';
    const brand = cleanCard.startsWith('5') ? 'mastercard' : cleanCard.startsWith('3') ? 'amex' : 'visa';

    return {
      success: true,
      transactionId: paymentIntentId,
      transactionReference: `STR-${chargeId.toUpperCase().slice(0, 16)}`,
      provider: 'stripe',
      amount: request.amount,
      currency: request.currency,
      status: 'success',
      message: `Paiement sécurisé par carte bancaire Stripe de ${request.amount.toLocaleString('fr-FR')} ${request.currency} validé (3D Secure).`,
      timestamp,
      receiptUrl: `https://pay.stripe.com/receipts/acct_appexcel/${paymentIntentId}`,
      gatewayResponse: {
        id: paymentIntentId,
        object: 'payment_intent',
        amount: request.amount,
        currency: request.currency.toLowerCase() === 'fcfa' ? 'xof' : request.currency.toLowerCase(),
        status: 'succeeded',
        charges: {
          data: [
            {
              id: chargeId,
              amount: request.amount,
              billing_details: {
                name: cardHolder || request.customer.name,
                email: request.customer.email
              },
              payment_method_details: {
                card: {
                  brand,
                  last4,
                  exp_month: cardExp ? parseInt(cardExp.split('/')[0], 10) || 12 : 12,
                  exp_year: cardExp ? parseInt(cardExp.split('/')[1], 10) || 2028 : 2028,
                  funding: 'credit',
                  three_d_secure: {
                    authenticated: true,
                    result: 'attempt_acknowledged'
                  }
                },
                type: 'card'
              },
              paid: true,
              receipt_url: `https://pay.stripe.com/receipts/${chargeId}`
            }
          ]
        },
        livemode: false,
        created: Math.floor(Date.now() / 1000)
      }
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      transactionId,
      transactionReference: `STR-VERIF-${transactionId.slice(-6)}`,
      provider: 'stripe',
      amount: 0,
      currency: 'XOF',
      status: 'success',
      message: 'Intention de paiement Stripe confirmée.',
      timestamp: new Date().toISOString(),
      gatewayResponse: { status: 'succeeded' }
    };
  }
}
