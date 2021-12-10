import { AdvertiserPayload, CategoryPayload } from "../entities";

export interface GetPromotablesPayload {
  /**
   * Advertiser details
   */
  advertiser: AdvertiserPayload;

  /**
   * Category details
   */
  category: CategoryPayload;
}
