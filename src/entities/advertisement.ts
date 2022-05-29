import { Nullable } from "../util";

export interface Advertisement {
   /**
    * Advertisement ID
    */
  id: string;

  /**
   * Slot ID
   */
  slot_id: string;

  /**
   * Advertiser ID
   */
  advertiser_id: string;

  /**
   * Publisher ID
   */
  publisher_id: string;
  
  content: Nullable<string>;
  
  click_url: Nullable<string>;

  /**
   * Destination url
   */
  redirect_url: string;

  /**
   * Name generated from promotable webhook or user input
   */
  name: string;

  /**
   * Image url from promotable webhook or user input
   */
  image_url: Nullable<string>;

  /**
   * Description generated from promotable webhook or user input
   */
  description: Nullable<string>;
  status: string;
  approval_status: Nullable<string>;

  /**
   * Daily budget
   */
  daily_budget: number;

  custom_fields: Nullable<object>;

  created_at: Date;
  updated_at: Date;
  deleted_at: Nullable<Date>;
}