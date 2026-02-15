export interface ApiUser {
  _id: string;
  accountNumber: string;
  routingNumber: string;
  wallets: { chain: string; asset: string; address: string; label?: string }[];
  name?: string;
  email?: string;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(typeof window !== "undefined" ? { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } : {}),
    },
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || res.statusText);
  }
  return res.json();
}

export interface CardResponse {
  id: string;
  maskedNumber: string;
  last4: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  brand: string;
  status: string;
  balance: number;
  metadata?: { purpose?: string; label?: string; color?: string };
}

export interface CardDetails extends CardResponse {
  cardNumber: string;
  cvv: string;
  spendingLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  totalSpent: number;
}

export const bankingApi = {
  getAccount: (userId: string) => request<{ accountNumber: string; routingNumber: string; wallets: ApiUser["wallets"]; balance?: number; name?: string }>(`/api/banking/account/${userId}`),
  internalTransfer: (body: any) => request(`/api/banking/transfers/internal`, { method: "POST", body: JSON.stringify(body) }),
  externalTransfer: (body: any) => request(`/api/banking/transfers/external`, { method: "POST", body: JSON.stringify(body) }),
  crypto: (direction: "deposit" | "withdraw", body: any) => request(`/api/banking/crypto/${direction}`, { method: "POST", body: JSON.stringify(body) }),
  giftcard: (body: any) => request(`/api/banking/giftcards/purchase`, { method: "POST", body: JSON.stringify(body) }),
  virtualCard: (body: any) => request(`/api/banking/virtual-cards/purchase`, { method: "POST", body: JSON.stringify(body) }),
  flight: (body: any) => request(`/api/banking/flights/book`, { method: "POST", body: JSON.stringify(body) }),
  approveTxn: (id: string) => request(`/api/banking/admin/transactions/${id}/approve`, { method: "POST" }),
  updateWallet: (userId: string, index: number, address: string) =>
    request(`/api/banking/admin/users/${userId}/wallets/${index}`, { method: "POST", body: JSON.stringify({ address }) }),
};

export const cardsApi = {
  // Get all user cards
  list: () => request<{ cards: CardResponse[]; total: number }>(`/api/cards`),

  // Get card details with sensitive info
  getDetails: (cardId: string) => request<CardDetails>(`/api/cards/${cardId}`),

  // Issue new virtual card
  issue: (body: { fundingAmount: number; purpose?: string; label?: string; color?: string; brand?: string }) =>
    request<{ message: string; card: CardResponse; newBalance: number }>(`/api/cards/issue`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Fund existing card
  fund: (cardId: string, amount: number) =>
    request<{ message: string; cardBalance: number; accountBalance: number }>(`/api/cards/${cardId}/fund`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),

  // Freeze/unfreeze card
  toggleFreeze: (cardId: string) =>
    request<{ message: string; status: string }>(`/api/cards/${cardId}/freeze`, { method: "POST" }),

  // Cancel card
  cancel: (cardId: string) =>
    request<{ message: string; refundedAmount: number; accountBalance: number }>(`/api/cards/${cardId}/cancel`, {
      method: "POST",
    }),
};

export interface GiftCardResponse {
  id: string;
  code: string;
  amount: number;
  currency: string;
  status: "active" | "redeemed" | "expired" | "cancelled";
  recipient?: string;
  createdAt: string;
  expiresAt?: string;
}

export const giftcardsApi = {
  // Get all user's gift cards
  list: () => request<{ giftcards: GiftCardResponse[]; total: number }>(`/api/giftcards`),

  // Issue new gift card
  issue: (body: { amount: number; recipient?: string; currency?: string }) =>
    request<{
      message: string;
      giftcard: GiftCardResponse;
      fee: number;
      totalCharged: number;
      newBalance: number;
    }>(`/api/giftcards/issue`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Redeem a gift card
  redeem: (code: string) =>
    request<{ message: string; amount: number; newBalance: number }>(`/api/giftcards/redeem`, {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
};
