import { Nullable } from "../util";

interface APIOnlyMetaData {
  /**
   * Advertiser email
   */
  email: string;

  /**
   * External user identifier
   */
  externalUserId: string;

  /**
   * Created stripe customer identifier
   */
  stripeCustomerId: string;
}

export interface AdvertiserPayload {
  /**
   * Advertiser ID
   */
  id: string;

  /**
   * Balance
   */
  balance: number;

  /**
   * API Only meta data for advertisers
   */
  apiOnlyMetaData: Nullable<APIOnlyMetaData>;
}
