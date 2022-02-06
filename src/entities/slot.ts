export interface SlotPayload {
  /**
   * Slot ID
   */
  id: string;

  /**
   * Slot name
   */
  name: string;

  /**
   * Slot description
   */
  description: string;

  /**
   * Slot website
   */
  website: string;

  /**
   * Slot status
   */
  status: "PAUSED" | "RUNNING";
}
