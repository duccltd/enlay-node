import { Advertisement } from "./advertisement";

export interface Placement {
  /**
   * Placement ID
   */
  id: string;

  /**
   * Timestamp
   */
  timestamp: string;

  /**
   * Slot ID
   */
  slotId: string;

  /**
   * Advertisement ID
   */
  advertisementId: string;

  /**
   * Publisher ID
   */
  publisherId: string;

  /**
   * Serve ID
   */
  serveId: string;

  /**
   * Advertisement metadata
   */
  advertisement: Advertisement;
}