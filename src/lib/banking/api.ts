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

export const bankingApi = {
  getAccount: (userId: string) => request<{ accountNumber: string; routingNumber: string; wallets: ApiUser["wallets"] }>(`/api/banking/account/${userId}`),
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
