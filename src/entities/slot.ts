import { Nullable } from "../util";

export interface Slot {
  /**
   * Slot ID
   */
  id: string;

  /**
   * Publisher ID
   */
  publisherId: string;

  /**
   * User ID
   */
  userId: string;

  /**
   * Category ID
   */
  categoryId: string;

  /**
   * Slot name
   */
  name: string;

  /**
   * Slot website
   */
  website: string;

  /**
   * Slot description
   */
  description: Nullable<string>;

  /**
   * Slot status
   */
  status: string;

  customFields: Nullable<object>;
}
