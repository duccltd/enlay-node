import { Nullable } from "../util";

export interface Advertisement {
   /**
    * Advertisement ID
    */
  id: string;

  /**
   * Slot ID
   */
  slotId: string;

  /**
   * Advertiser ID
   */
  advertiserId: string;

  /**
   * Publisher ID
   */
  publisherId: string;
  
  content: Nullable<string>;
  
  clickUrl: Nullable<string>;

  /**
   * Destination url
   */
  redirectUrl: string;

  /**
   * Name generated from promotable webhook or user input
   */
  name: string;

  /**
   * Image url from promotable webhook or user input
   */
  imageUrl: Nullable<string>;

  /**
   * Description generated from promotable webhook or user input
   */
  description: Nullable<string>;
  status: string;
  approvalStatus: Nullable<string>;

  /**
   * Daily budget
   */
  dailyBudget: number;

  customFields: Nullable<object>;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Nullable<Date>;
}