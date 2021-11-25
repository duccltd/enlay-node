import Enlay from "../../lib";
import express, { Request, Response } from "express";
import { GetPromotablesPayload } from "../../lib/events";
import { PromotablePayload } from "../../lib/entities";

const enlay = new Enlay("api_token_123");

const app = express();

app.post("/enlay/products", async (req: Request, res: Response) => {
  const _event = enlay.webhooks.constructEvent<GetPromotablesPayload>(req.body);

  /*
  // Get users products by email
  const { email } = event.data.advertiser;

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
