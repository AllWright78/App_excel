import { PaymentGateway, PaymentRequest, PaymentResult } from './types';

/**
 * TMoney Payment Gateway Implementation
 * Handles Togocom TMoney Mobile Money push payments (Togo & UEMOA)
 */
export class TMoneyPaymentGateway implements PaymentGateway {
  readonly providerName = 'TMoney (Togocom)';

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    const rawPhone = (request.paymentDetails.phoneNumber || request.customer.phone || '').replace(/[\s\-\+]/g, '');
    const cleanPhone = rawPhone.startsWith('228') ? rawPhone.slice(3) : rawPhone;

    if (!cleanPhone || cleanPhone.length < 8) {
      return {
        success: false,
        transactionId: `tx-tmn-fail-${Date.now()}`,
        transactionReference: `TMN-ERR-${Date.now()}`,
        provider: 'tmoney',
        amount: request.amount,
        currency: request.currency,
        status: 'failed',
        message: 'Numéro de téléphone TMoney invalide. Veuillez fournir un numéro Togocom valide (ex: 90 00 00 00).',
        timestamp: new Date().toISOString(),
        gatewayResponse: {
          errorCode: 'INVALID_SUBSCRIBER',
          provider: 'Togocom TMoney',
          rawPhone
        }
      };
    }

    // Simulate Togocom API network latency and USSD push interaction
    await new Promise(resolve => setTimeout(resolve, 1400));

    const timestamp = new Date().toISOString();
    const transactionId = `tx-tmn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const transactionReference = `TMN-TG-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      transactionId,
      transactionReference,
      provider: 'tmoney',
      amount: request.amount,
      currency: request.currency,
      status: 'success',
      message: `Paiement TMoney de ${request.amount.toLocaleString('fr-FR')} ${request.currency} confirmé par Togocom.`,
      timestamp,
      ussdPrompt: '*145# validé',
      receiptUrl: `#/receipt?provider=tmoney&tx=${transactionReference}`,
      gatewayResponse: {
        responseCode: '200',
        responseMessage: 'APPROVED',
        togocomReference: `TGC-${Date.now()}`,
        network: 'Togocom TMoney',
        subscriberMsisdn: cleanPhone,
        amountDebited: request.amount,
        currency: request.currency,
        merchantId: 'APP_EXCEL_TOGOOM',
        recordedAt: timestamp
      }
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      transactionId,
      transactionReference: `TMN-VERIF-${transactionId.slice(-6)}`,
      provider: 'tmoney',
      amount: 0,
      currency: 'XOF',
      status: 'success',
      message: 'Paiement TMoney vérifié auprès des serveurs Togocom.',
      timestamp: new Date().toISOString(),
      gatewayResponse: { verified: true }
    };
  }
}
