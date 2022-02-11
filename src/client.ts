import axios, { AxiosInstance } from "axios";
import { SlotPayload, CategoryPayload, PlacementPayload, AdvertiserPayload, AdvertisementPayload } from "./entities";
import * as Webhooks from "./webhooks";

type CreatePlacementOptions = Partial<{
  max: number;
  unique: boolean;
  urlParameters: Record<string, string | number>;
  httpHeaders: Record<string, string | number>;
}>;

type CreateAdvertiserInput = {
  email: string;
  externalUserId: string;
};

type CreateAdvertisementInput = {
  slotId: string;
  name: string;
  redirectUrl: string;
  description: string;
  dailyBudget: number;
  advertiserId: string;
  image: File;
};

type GetSlotsOptions = Partial<{
  id: string;
}>;

type GetCategoriesOptions = Partial<{
  id: string;
}>;

type FindAdvertisementsInput = Partial<{
  id: string;
  advertiserId: string;
}>;

type Error = {
  message: string;
  locations: any[];
  path: string[];
  extenstions: {
    validation_errors: Record<string, string>;
  };
};

type GraphQLResponse<QueryKey extends string, QueryResponse> = {
  data: {
    [key in QueryKey]: QueryResponse;
  };
  errors: Error[];
};

interface EnlayRequests {
  createPlacements: (
    slotId: string,
    options: CreatePlacementOptions
  ) => Promise<{
    data: {
      createPlacements: PlacementPayload[];
    };
    errors: any[];
  }>;
}

interface IEnlayConfig {
  apiToken?: string;
  baseUrl?: string;
}

/**
 * @param {apiToken} API Token - This should not be exposed client side
 * @param {baseUrl} API Base
 */
class Enlay implements EnlayRequests {
  public readonly client: AxiosInstance;
  private readonly apiToken?: string;

  constructor(config: IEnlayConfig = {}) {
    const { apiToken, baseUrl } = config;

    this.apiToken = apiToken;
    this.client = axios.create({
      baseURL: baseUrl ?? "https://api.enlay.io",
      headers: apiToken
        ? {
          Authorization: apiToken,
        }
        : {},
    });
  }

  get webhooks() {
    return Webhooks;
  }

  /**
   * Register a click on an advertisement
   * @param placementId Placement id obtained from create placemens
   */
  public async registerClick(placementId: string): Promise<void> {
    await this.client.request({
      method: "GET",
      url: `/p/${placementId}/c`,
    });
  }

  /**
   *
   * @param placementIds Placement ids obtained from create placements
   */
  public async registerView(placementIds: string[]): Promise<void> {
    await this.client.request({
      method: "POST",
      url: `/p/v`,
      data: placementIds.map((pid) => ({
        id: pid,
      })),
    });
  }

  /**
   * 
   * @param options Options for creating an advertiser
   * @returns Advertiser object
   */
  public async createAdvertiser(options: CreateAdvertiserInput): Promise<GraphQLResponse<"createAdvertiser", string>> {
    if (!this.apiToken) {
      throw new Error("API Token is undefined in constructor.");
    }
    const { data } = await this.client.request<
      GraphQLResponse<"createAdvertiser", string>
    >({
      method: "POST",
      url: "/graphql",
      data: {
        query: `
          mutation CreateAdvertiser(
            $metadata: JSON!
          ) {
            createAdvertiser(input: {
              metadata: $metadata
            })
          }
        `,
        variables: {
          metadata: options,
        },
      },
    });

    return data;
  }

  /**
   * 
   * @param advertiserId Advertiser identifier
   * @returns Advertiser
   */
  public async getAdvertiser(advertiserId: string): Promise<GraphQLResponse<"currentAdvertiser", AdvertiserPayload>> {
    if (!this.apiToken) {
      throw new Error("API Token is undefined in constructor.");
    }
    const { data } = await this.client.request<
      GraphQLResponse<"currentAdvertiser", AdvertiserPayload>
    >({
      method: "POST",
      url: "/graphql",
      data: {
        query: `
           query CurrentAdvertiser(
                $id: String!
            ) {
              currentAdvertiser(
                input: {
                  id: $id
                }
              ) {
                id
                balance
                apiOnlyMetadata {
                    email
                    externalUserId
                    stripeCustomerId
                }
              }
            }
            `,
        variables: {
          id: advertiserId
        },
      },
    });

    return data;
  }

  /**
   * 
   * @param options Find advertisements filter
   * @returns Advertisement array
   */
  public async getAdvertisements(options: FindAdvertisementsInput = {}): Promise<GraphQLResponse<"findAdvertisements", AdvertisementPayload[]>> {
    if (!this.apiToken) {
      throw new Error("API Token is undefined in constructor.");
    }
    const { data } = await this.client.request<
      GraphQLResponse<"findAdvertisements", AdvertisementPayload[]>
    >({
      method: "POST",
      url: "/graphql",
      data: {
        query: `
            query FindAdvertisements(
                $filter: JSON,
            ) {
                findAdvertisements(input: {
                    filter: $filter
                }) {
                    id
                    name
                    description
                    redirectUrl
                    status
                    imageUrl
                    dailyBudget
                    updatedAt
                }
            }
        `,
        variables: {
          filter: options,
        },
      },
    });

    return data;
  }

  /**
   * 
   * @param options Create advertisement options
   * @returns Advertisement identifier
   */
  public async createAdvertisement(options: CreateAdvertisementInput): Promise<GraphQLResponse<"createAdvertisement", string>> {
    if (!this.apiToken) {
      throw new Error("API Token is undefined in constructor.");
    }
    const { data } = await this.client.request<
      GraphQLResponse<"createAdvertisement", string>
    >({
      method: "POST",
      url: "/graphql",
      data: {
        query: `
           mutation CreateAdvertisement(
                $slotId: String!,
                $name: String!,
                $redirectUrl: String,
                $description: String!,
                $dailyBudget: Int!,
                $advertiserId: String!,
                $image: Upload
            ) {
              createAdvertisement(
                input: {
                  slotId: $slotId
                  name: $name
                  redirectUrl: $redirectUrl
                  description: $description,
                  dailyBudget: $dailyBudget,
                  advertiserId: $advertiserId
                }
                image: $image
              )
            }
            `,
        variables: options,
      },
    });

    return data;
  }

  /**
   * 
   * @param categoryId Category ID
   * @param filter Get slots filter
   * @returns Slot array
   */
  public async getSlots(
    categoryId: string,
    filter: GetSlotsOptions = {}
  ): Promise<GraphQLResponse<"findSlots", SlotPayload[]>> {
    if (!this.apiToken) {
      throw new Error("API Token is undefined in constructor.");
    }
    const { data } = await this.client.request<
      GraphQLResponse<"findSlots", SlotPayload[]>
    >({
      method: "POST",
      url: "/graphql",
      data: {
        query: `
            query FindSlots(
                $categoryId: String!,
                $filter: JSON,
            ) {
                findSlots(input: {
                    categoryId: $categoryId,
                    filter: $filter
                }) {
                    id
                    name
                    description
                    website
                    status
                }
            }
        `,
        variables: {
          categoryId,
          filter,
        },
      },
    });

    return data;
  }

  /**
   * 
   * @param filter Get categories filter
   * @returns Category array
   */
  public async getCategories(
    filter: GetCategoriesOptions = {}
  ): Promise<GraphQLResponse<"findCategories", CategoryPayload[]>> {
    if (!this.apiToken) {
      throw new Error("API Token is undefined in constructor.");
    }
    const { data } = await this.client.request<
      GraphQLResponse<"findCategories", CategoryPayload[]>
    >({
      method: "POST",
      url: "/graphql",
      data: {
        query: `
            query FindCategories(
                $filter: JSON,
            ) {
                findCategories(input: {
                    filter: $filter
                }) {
                    id
                    name
                    description
                }
            }
        `,
        variables: {
          filter,
        },
      },
    });

    return data;
  }

  /**
   *
   * @param slotId Slot identifier obtained from publishers.enlay.io
   * @param options Create placement options
   * @returns Collection of placements
   */
  public async createPlacements(
    slotId: string,
    options: Partial<CreatePlacementOptions> = { max: 1, unique: true }
  ): Promise<GraphQLResponse<"createPlacements", PlacementPayload[]>> {
    const { data } = await this.client.request<
      GraphQLResponse<"createPlacements", PlacementPayload[]>
    >({
      method: "POST",
      url: "/graphql",
      data: {
        query: `
            mutation CreatePlacements(
                $slotId: String!,
                $max: Int,
                $unique: Boolean
            ) {
                createPlacements(input: {
                    slotId: $slotId
                    max: $max
                    unique: $unique
                }) {
                    id
                    advertisement {
                        name
                        description
                        imageUrl
                        redirectUrl
                        customFields
                    }
                }
            }
        `,
        variables: {
          slotId,
          ...options,
        },
      },
    });
    return data;
  }
}

export default Enlay;
