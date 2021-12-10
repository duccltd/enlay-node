import { Nullable } from "../util";

export interface AdvertiserPayload {
  /**
   * Advertiser email
   */
  email: string;

  /**
   * Advertiser discord identifier
   */
  discord_id: Nullable<string>;
}
