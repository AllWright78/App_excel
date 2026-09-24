import { PaymentGateway, PaymentRequest, PaymentResult } from './types';
import { FloozPaymentGateway } from './FloozPaymentGateway';
import { TMoneyPaymentGateway } from './TMoneyPaymentGateway';
import { StripePaymentGateway } from './StripePaymentGateway';
import { PaymentMethod } from '../../types';

class BankTransferPaymentGateway implements PaymentGateway {
  readonly providerName = 'Virement Bancaire (UEMOA / SEPA)';

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const txId = `tx-bank-${Date.now()}`;
    const txRef = `VIR-TG-${Date.now().toString(36).toUpperCase()}`;

    return {
      success: true,
      transactionId: txId,
      transactionReference: txRef,
      provider: 'bank_transfer',
      amount: request.amount,
      currency: request.currency,
      status: 'pending',
      message: 'Ordre de virement bancaire généré. Vos clés seront débloquées dès réception des fonds.',
      timestamp: new Date().toISOString(),
      gatewayResponse: {
        rib: 'TG024 01001 001234567890 45',
        bank: 'Ecobank Togo SA',
        beneficiary: 'GESTE APP INTERNATIONAL',
        swift: 'ECOCTGXXXX'
      }
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    return {
      success: true,
      transactionId,
      transactionReference: transactionId,
      provider: 'bank_transfer',
      amount: 0,
      currency: 'XOF',
      status: 'success',
      message: 'Virement bancaire validé par le service comptable.',
      timestamp: new Date().toISOString(),
      gatewayResponse: {}
    };
  }
}

class CashOnDeliveryPaymentGateway implements PaymentGateway {
  readonly providerName = 'Paiement à la livraison / physique';

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const txId = `tx-cod-${Date.now()}`;
    return {
      success: true,
      transactionId: txId,
      transactionReference: `COD-${Date.now().toString(36).toUpperCase()}`,
      provider: 'cod',
      amount: request.amount,
      currency: request.currency,
      status: 'pending',
      message: 'Commande enregistrée avec paiement à la livraison (clé remise en main propre ou clé physique sur clé USB).',
      timestamp: new Date().toISOString(),
      gatewayResponse: { deliveryType: 'HAND_TO_HAND' }
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    return {
      success: true,
      transactionId,
      transactionReference: transactionId,
      provider: 'cod',
      amount: 0,
      currency: 'XOF',
      status: 'success',
      message: 'Règlement physique enregistré.',
      timestamp: new Date().toISOString(),
      gatewayResponse: {}
    };
  }
}

/**
 * PaymentGatewayFactory
 * Creates and returns the appropriate gateway based on provider
 */
export class PaymentGatewayFactory {
  private static gateways: Map<string, PaymentGateway> = new Map();

  static getGateway(method: PaymentMethod): PaymentGateway {
    const key = method.toLowerCase();

    if (!this.gateways.has(key)) {
      switch (key) {
        case 'flooz':
          this.gateways.set(key, new FloozPaymentGateway());
          break;
        case 'tmoney':
          this.gateways.set(key, new TMoneyPaymentGateway());
          break;
        case 'stripe':
        case 'card':
          this.gateways.set(key, new StripePaymentGateway());
          break;
        case 'bank_transfer':
          this.gateways.set(key, new BankTransferPaymentGateway());
          break;
        case 'cod':
          this.gateways.set(key, new CashOnDeliveryPaymentGateway());
          break;
        default:
          this.gateways.set(key, new StripePaymentGateway());
          break;
      }
    }

    return this.gateways.get(key)!;
  }
}
