export interface Promotable {
  /**
   * ID of the Promotable
   */
  id: string;

  /**
   * Display name of the promotable to advertisers
   */
  display_name: string;

  /**
   * Description of the advertisement
   */
  description?: string;

  /**
   * Advertisement image
   */
  image_url?: string;
}
