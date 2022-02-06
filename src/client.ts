import axios, { AxiosInstance } from "axios";
import { SlotPayload, CategoryPayload, PlacementPayload } from "./entities";
import * as Webhooks from "./webhooks";

type CreatePlacementOptions = Partial<{
  max: number;
  unique: boolean;
  urlParameters: Record<string, string | number>;
  httpHeaders: Record<string, string | number>;
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
  private readonly client: AxiosInstance;
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

  public async createAdvertiser(options: {
    email: string;
    external_user_id: string;
  }): Promise<GraphQLResponse<"createAdvertiser", string>> {
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

  public async createAdvertisement(options: {
    slotId: string;
    name: string;
    redirectUrl?: string;
    description: string;
    dailyBudget: number;
    image?: File;
  }): Promise<GraphQLResponse<"createAdvertisement", string>> {
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
                $image: Upload
            ) {
              createAdvertisement(
                input: {
                  slotId: $slotId
                  name: $name
                  redirectUrl: $redirectUrl
                  description: $description,
                  dailyBudget: $dailyBudget,
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

  public async getSlots(
    categoryId: string,
    filter: Partial<{
      id: string;
    }> = {}
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

  public async getCategories(
    filter: Partial<{
      id: string;
    }> = {}
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
