import { Nullable } from "../util";

export interface Category {
  /**
   * Category ID
   */
  id: string;

  /**
   * Publisher ID
   */
  publisherId: string;

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
  approvalMode: Nullable<string>;

  /**
   * Creation type
   */
  creationType: string;

  /**
   * Metadata
   */
  creationMode: {
    webhookUrl: string;
  } | {};

  createdAt: string;
  updatedAt: string;
  deletedAt: Nullable<Date>;
}