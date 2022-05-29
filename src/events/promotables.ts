import { Advertiser, Category } from "../entities";

export interface GetPromotablesPayload {
  /**
   * Advertiser details
   */
  advertiser: Advertiser;

  /**
   * Category details
   */
  category: Category;
}
