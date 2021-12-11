import { GetPromotablesPayload } from "./events/promotables";

enum WebhookType {
  PROMOTABLE = "PROMOTABLE",
}

type WebhookPayload = GetPromotablesPayload;

type PayloadKey<T> = T extends GetPromotablesPayload ? "promotable" : never;

type WebhookBase<P extends WebhookPayload> = {
  [key in PayloadKey<P>]: P;
};

interface Webhook<T extends WebhookPayload> {
  id: string;
  timestamp: String;
  type: WebhookType;
  data: WebhookBase<T>;
}

const constructEvent = <T extends WebhookPayload>(
  body: unknown
): Webhook<T> => {
  // TODO: Validate signature

  return body as any;
};

export { constructEvent };
