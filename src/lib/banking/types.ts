export type Role = "user" | "admin";

export type KycStatus = "not_started" | "pending" | "verified" | "rejected";

export type KycLevel = "not_started" | "level1" | "level2";

export interface NameParts {
  first: string;
  last?: string;
  full: string;
}

export interface Account {
  number: string;
  routingNumber: string;
  balance: number;
  currency: string;
}

export interface WalletAddress {
  chain: string;
  asset: string;
  address: string;
  label?: string;
}

export interface KycInfo {
  status: KycStatus;
  level: KycLevel;
  updatedAt: string | null;
}

export interface UserFlags {
  blocked: boolean;
  walletMaintenance: boolean;
  cardActive: boolean;
  dormancy: boolean;
}

export interface UserMetadata {
  createdAt?: string | null;
  legacyAccountNumber?: string | null;
  legacyBankName?: string | null;
}

export interface User {
  id: string;
  legacyId: string;
  externalId: string | null;
  role: Role;
  isAdmin?: boolean; // Backend compatibility
  name: NameParts;
  email: string | null;
  phone: string | null;
  countryCode: string;
  account: Account;
  kyc: KycInfo;
  flags: UserFlags;
  metadata: UserMetadata;
  wallets?: WalletAddress[];
}

export type TransactionKind =
  | "internal_transfer"
  | "external_transfer"
  | "crypto_deposit"
  | "crypto_withdrawal"
  | "gift_card_purchase"
  | "virtual_card_purchase"
  | "flight_booking"
  | "fee";

export type TransactionStatus = "pending" | "completed" | "failed" | "canceled";

export interface Transaction {
  id: string;
  userId: string;
  kind: TransactionKind;
  amount: number;
  currency: string;
  description: string;
  status: TransactionStatus;
  createdAt: string;
  meta?: Record<string, string | number | boolean | null>;
}

export interface FeeConfig {
  externalTransferPercent: number;
  virtualCardFee: number;
  giftCardFee: number;
  flightBookingFee: number;
}

export interface GiftCardProduct {
  id: string;
  name: string;
  denomination: number;
  currency: string;
  tags?: string[];
}

export interface VirtualCardProduct {
  id: string;
  label: string;
  issuanceFee: number;
  currency: string;
  fxMarkup: number;
}

export interface FlightVendor {
  id: string;
  name: string;
  note: string;
}

export interface BankingSeed {
  users: User[];
  transactions: Transaction[];
  giftCards: GiftCardProduct[];
  virtualCards: VirtualCardProduct[];
  feeConfig: FeeConfig;
  flightVendors: FlightVendor[];
}
