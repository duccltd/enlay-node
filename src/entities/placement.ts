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
  slot_id: string;

  /**
   * Advertisement ID
   */
  advertisement_id: string;

  /**
   * Publisher ID
   */
  publisher_id: string;

  /**
   * Serve ID
   */
  serve_id: string;

  /**
   * Advertisement metadata
   */
  advertisement: Advertisement;
}