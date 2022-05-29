import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as Webhooks from "./webhooks";
import * as Advertisements from "./resources/advertisement";
import * as Advertisers from "./resources/advertiser";
import * as Categories from "./resources/categories";
import * as Images from "./resources/images";
import * as Placements from "./resources/placements";
import * as Slots from "./resources/slot";
import * as Transactions from "./resources/transactions";
import { camelizeKeys, decamelizeKeys } from "humps";

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
      createPlacements: any[];
    };
    errors: any[];
  }>;
}

interface IEnlayConfig {
  apiToken?: string;
  baseUrl?: string;
}

export let client: AxiosInstance;

/**
 * @param {apiToken} API Token - This should not be exposed client side
 * @param {baseUrl} API Base
 */
class Enlay implements EnlayRequests {
  constructor(config: IEnlayConfig = {}) {
    const { apiToken, baseUrl } = config;

    client = axios.create({
      baseURL: baseUrl ?? "https://api.enlay.io",
      headers: apiToken
        ? {
          Authorization: apiToken,
        }
        : {},
    });

    client.interceptors.response.use((response) => {
      if (
        response.data &&
        response.headers['content-type'] === 'application/json'
      ) {
        response.data = camelizeKeys(response.data);
      }
      return response;
    });

    // Axios middleware to convert all api requests to snake_case
    client.interceptors.request.use((config: AxiosRequestConfig) => {
      const newConfig = { ...config };
      if (newConfig.headers?.['Content-Type'] === 'multipart/form-data')
        return newConfig;
      if (config.params) {
        newConfig.params = decamelizeKeys(config.params);
      }
      if (config.data) {
        newConfig.data = decamelizeKeys(config.data);
      }
      return newConfig;
    });
  }

  get webhooks() {
    return Webhooks;
  }

  get advertisements() {
    return Advertisements;
  }

  get advertisers() {
    return Advertisers;
  }

  get categories() {
    return Categories;
  }

  get images() {
    return Images;
  }

  get placements() {
    return Placements;
  }

  get slots() {
    return Slots;
  }

  get transactions() {
    return Transactions;
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
  ): Promise<GraphQLResponse<"createPlacements", any[]>> {
    const { data } = await client.request<
      GraphQLResponse<"createPlacements", any[]>
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
