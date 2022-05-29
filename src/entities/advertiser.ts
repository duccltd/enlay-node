import { Nullable } from "../util";

export interface Advertiser {
  /**
   * Advertiser ID
   */
  id: string;

  /**
   * Publisher ID
   */
  publisher_id: string;

  /**
   * Advertiser email
   */
  email: string;


  discord_id: Nullable<string>;
}
