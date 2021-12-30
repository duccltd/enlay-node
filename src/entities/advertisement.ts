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
  customFields: {
    id: string;
  };
}
