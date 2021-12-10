import { GetPromotablesPayload } from "./events/promotables";

enum WebhookType {
  PROMOTABLE = "PROMOTABLE",
}

type WebhookPayload = GetPromotablesPayload;

interface Webhook<T extends WebhookPayload> {
  id: string;
  timestamp: String;
  type: WebhookType;
  data: T;
}

const constructEvent = <T extends WebhookPayload>(
  body: unknown
): Webhook<T> => {
  // TODO: Validate signature

  const data = JSON.parse(String(body));

  return data;
};

export { constructEvent };
