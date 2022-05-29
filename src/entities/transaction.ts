export interface Transaction {
  /**
   * Transaction ID
   */
  transaction_id: string;

  /**
   * Advertiser ID
   */
  advertiser_id: string;

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
  slot_id: any;

  /**
   * Advertisement ID
   */
  advertisement_id: any;
}
