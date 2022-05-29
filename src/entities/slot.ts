import { Nullable } from "../util";

export interface Slot {
  /**
   * Slot ID
   */
  id: string;

  /**
   * Publisher ID
   */
  publisher_id: string;

  /**
   * User ID
   */
  user_id: string;

  /**
   * Category ID
   */
  category_id: string;

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

  custom_fields: Nullable<object>;
}
