export interface AdvertisementPayload {
  /**
   * Name generated from promotable webhook or user input
   */
  name: string;

  /**
   * Description generated from promotable webhook or user input
   */
  description?: string;

  /**
   * Image url from promotable webhook or user input
   */
  imageUrl?: string;

  /**
   * Slot ID
   */
  slotId?: string;

  /**
   * Destination url
   */
  redirectUrl?: string;

  /**
   * Daily budget
   */
  dailyBudget?: number;

  customFields: {
    id: string;
  };
}
