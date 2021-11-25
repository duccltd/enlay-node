import { Advertisement } from "./advertisement";

export interface PlacementPayload {
  /**
   * Placement ID
   */
  id: string;

  /**
   * Advertisement information
   */
  advertisement: Pick<Advertisement, "customFields">;
}
