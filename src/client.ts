import axios, { AxiosInstance } from "axios";
import { PlacementPayload } from "./entities";
import * as Webhooks from "./webhooks";

type CreatePlacementOptions = Partial<{
  max: number;
  unique: boolean;
  urlParameters: Record<string, string | number>;
  httpHeaders: Record<string, string | number>;
}>;

interface EnlayRequests {
  createPlacements: (
    slotId: string,
    options: CreatePlacementOptions
  ) => Promise<PlacementPayload[]>;
}

class Enlay implements EnlayRequests {
  private readonly client: AxiosInstance;

  constructor(apiToken: string, baseUrl?: string) {
    this.client = axios.create({
      baseURL: baseUrl ?? "https://api.enlay.io/graphql",
      headers: {
        Authorization: apiToken,
      },
    });
  }

  get webhooks() {
    return Webhooks;
  }

  public async createPlacements(
    slotId: string,
    options: Partial<CreatePlacementOptions> = { max: 1, unique: true }
  ): Promise<PlacementPayload[]> {
    const { data } = await this.client.request<PlacementPayload[]>({
      method: "POST",
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
