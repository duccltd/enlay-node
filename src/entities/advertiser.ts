import { Nullable } from "../util";

export interface Advertiser {
  /**
   * Advertiser ID
   */
  id: string;

  /**
   * Publisher ID
   */
  publisherId: string;

  /**
   * Advertiser email
   */
  email: string;


  discordId: Nullable<string>;
}
