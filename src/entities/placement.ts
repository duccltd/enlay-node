import { AdvertisementPayload } from "./advertisement";

export interface PlacementPayload {
  /**
   * Placement ID
   */
  id: string;

  /**
   * Advertisement information
   */
  advertisement: AdvertisementPayload;
}
