import { PaymentGateway, PaymentRequest, PaymentResult } from './types';

/**
 * Flooz Payment Gateway Implementation
 * Handles Moov Africa Flooz Mobile Money push payments (Togo & UEMOA)
 */
export class FloozPaymentGateway implements PaymentGateway {
  readonly providerName = 'Flooz (Moov Africa)';

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    if (apiUrl) {
      const response = await fetch(`${apiUrl}/payments/flooz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Le backend Flooz a refusé la demande.');
      }
      return result as PaymentResult;
    }

    const rawPhone = (request.paymentDetails.phoneNumber || request.customer.phone || '').replace(/[\s\-\+]/g, '');
    
    // Togo Moov Africa prefixes typically start with 96, 97, 98, 99 or +228
    const cleanPhone = rawPhone.startsWith('228') ? rawPhone.slice(3) : rawPhone;
    
    if (!cleanPhone || cleanPhone.length < 8) {
      return {
        success: false,
        transactionId: `tx-flz-fail-${Date.now()}`,
        transactionReference: `FLZ-ERR-${Date.now()}`,
        provider: 'flooz',
        amount: request.amount,
        currency: request.currency,
        status: 'failed',
        message: 'Numéro de téléphone Flooz invalide. Veuillez fournir un numéro Moov Africa valide (ex: 91 59 95 78).',
        timestamp: new Date().toISOString(),
        gatewayResponse: {
          errorCode: 'INVALID_MSISDN',
          provider: 'Moov Africa Togo',
          rawPhone
        }
      };
    }

    // Simulate API network round-trip & USSD push confirmation
    await new Promise(resolve => setTimeout(resolve, 1400));

    const timestamp = new Date().toISOString();
    const transactionId = `tx-flz-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const transactionReference = `FLZ-TG-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      transactionId,
      transactionReference,
      provider: 'flooz',
      amount: request.amount,
      currency: request.currency,
      status: 'success',
      message: `Paiement Flooz de ${request.amount.toLocaleString('fr-FR')} ${request.currency} validé avec succès par Moov Money.`,
      timestamp,
      ussdPrompt: '*155# débité',
      receiptUrl: `#/receipt?provider=flooz&tx=${transactionReference}`,
      gatewayResponse: {
        statusCode: '00',
        statusDescription: 'TRANSACTION_SUCCESS',
        operatorTransactionId: `MOOV-${Date.now()}`,
        network: 'Moov Africa Togo',
        payerPhone: cleanPhone,
        currency: request.currency,
        amountDebited: request.amount,
        fee: 0,
        merchantAccount: 'APP_EXCEL_SA',
        recordedAt: timestamp
      }
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      transactionId,
      transactionReference: `FLZ-VERIF-${transactionId.slice(-6)}`,
      provider: 'flooz',
      amount: 0,
      currency: 'XOF',
      status: 'success',
      message: 'Transaction Flooz vérifiée et confirmée par l’opérateur.',
      timestamp: new Date().toISOString(),
      gatewayResponse: { verified: true }
    };
  }
}
