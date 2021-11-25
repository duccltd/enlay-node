import Enlay from "../../lib";
import express, { Request, Response } from "express";

const enlay = new Enlay("api_token_123");

const app = express();

const slotId = "aaf09d65-dd8a-43e3-a420-24abe8ca13f0";

app.post("/products", async (_req: Request, res: Response) => {
  const _placements = await enlay.createPlacements(slotId, {
    max: 1,
    unique: true,
  });

  /*
    // Get products from the advertisement by promotable ids
    const products = await Something.getManyProductsById(
      placements.map(
        ({
          advertisement: {
            // Get the promotable id
            customFields: { id },
          },
        }) => id
      )
    );
  */

  return void res.json([
    {
      id: "product_123",
      name: "Crystal ball",
      // ...Product metadata
    },
  ]);
});
