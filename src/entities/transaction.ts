export interface Transaction {
  /**
   * Transaction ID
   */
  transactionId: string;

  /**
   * Advertiser ID
   */
  advertiserId: string;

  /**
   * Timestamp
   */
  timestamp: string;

  /**
   * Transaction type
   */
  type: string;

  /**
   * Transaction source
   */
  source: string;

  /**
   * Amount
   */
  amount: number;

  charge: any;
  deposit: any;

  /**
   * Slot ID
   */
  slotId: any;

  /**
   * Advertisement ID
   */
  advertisementId: any;
}
