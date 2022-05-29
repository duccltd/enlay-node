import { Nullable } from "../util";

export interface Category {
  /**
   * Category ID
   */
  id: string;

  /**
   * Publisher ID
   */
  publisher_id: string;

  /**
   * Category name
   */
  name: string;

  /**
   * Category description
   */
  description: Nullable<string>;

  /**
   * Approval mode
   */
  approval_mode: Nullable<string>;

  /**
   * Creation type
   */
  creation_type: string;

  /**
   * Metadata
   */
  creation_mode: {
    webhook_url: string;
  } | {};

  created_at: string;
  updated_at: string;
  deleted_at: Nullable<Date>;
}