import { PaymentMethod } from '../../types';

export interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  description?: string;
  paymentDetails: {
    phoneNumber?: string;
    cardNumber?: string;
    cardExp?: string;
    cardCvc?: string;
    cardHolder?: string;
    otp?: string;
    referenceNote?: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  transactionReference: string;
  provider: PaymentMethod;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  timestamp: string;
  receiptUrl?: string;
  ussdPrompt?: string;
  gatewayResponse: Record<string, any>;
}

export interface PaymentGateway {
  readonly providerName: string;
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<PaymentResult>;
}
