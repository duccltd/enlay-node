import Enlay from "../../src";
import express, { Request, Response } from "express";
import { GetPromotablesPayload } from "../../src/events";
import { PromotablePayload } from "../../src/entities";

const enlay = new Enlay({ apiToken: "api_token_123" });

const app = express();

app.post("/enlay/products", async (req: Request, res: Response) => {
  const _event = enlay.webhooks.constructEvent<GetPromotablesPayload>(req.body);

  /*
  // Get users products by email
  const { email } = event.data.promotable.advertiser;

  const products = await Something.getProductsByEmail(email);

  const payload = products.map((product) => ({
    id: product.id,
    display_name: product.name,
  }));

  return void res.json(payload);
  */

  /**
   * Products to send back must follow the schema
   */
  const products: PromotablePayload[] = [
    {
      id: "product_123",
      display_name: "Crystal ball",
    },
  ];

  return void res.json(products);
});
