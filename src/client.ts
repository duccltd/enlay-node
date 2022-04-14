import axios, { AxiosInstance } from "axios";
import { PlacementPayload } from "./entities";
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
   * @param placementId Placement id obtained from create placements
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
