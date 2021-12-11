# enlay-node

JavaScript library for the Enlay API.

## Installation

### yarn

```sh-session
yarn add @enlay/node
```

### NPM

```sh-session
npm install @enlay/node
```

## Usage

To be fully integrated with Enlay, we have composed a list of actionables below. These are essential for your integration to work.

### Backend

#### Creating the client

You should not expose the Enlay client with your token to the client. You can find your token on the [publisher dashboard](https://publisher.enlay.io/publisher).

```ts
// src/enlay/index.ts
import Enlay from "@enlay/node";

const enlay = new Enlay({
  apiToken: "ey5ab...",
});

export default enlay;
```

#### Fetching advertisement placements

The `slot-id ` can be found on your [publisher dashboard](https://publisher.enlay.io/publisher).

```ts
// src/products.ts
import enlay from "./enlay";

app.get(`/products`, (req, res) => {
  // Fetch the advertisement placements
  const { data, errors } = await enlay.createPlacements("slot-id", {
    max: 2,
    unique: true,
  });
  if (errors) {
    // Something went wrong at Enlay
  }

  // ...Fetch products and send to client
});
```

**Example** with data using knex

```ts
// src/products.ts
import enlay from "./enlay";

app.get(`/products`, (req, res) => {
  const products = await knex("products").select("*");

  // Fetch the advertisement placements
  const { data, errors } = await enlay.createPlacements("slot-id", {
    max: 2,
    unique: true,
  });
  if (errors) {
    return res.json(products);
  }

  // Fetch the correlated product ids
  const productIds = data.createPlacements.map((placement) => {
    return placement.advertisement.customFields.id;
  });

  // Fetch the sponsored products
  const sponsoredProducts = await knex("products")
    .select("*")
    .whereIn("id", productIds);

  // Append placement identifier to product
  const sponsored = sponsoredProducts.map((product) => {
    const placement = data.placements.find(
      (p) => p.advertisement.customFields.id === product.id
    );
    return {
      ...product,
      placementId: placement?.id,
    };
  });

  // Products could overlap so may need to filter
  return res.json([...sponsored, ...products]);
});
```

#### Creating webhook endpoint for fetching users promotables

This endpoint is needed so we know what products an advertiser can sponsor on your platform.

```ts
// src/enlay/products.ts
import enlay from "./enlay";
import { Events, Entities } from "@enlay/node";

app.get(`/enlay/products`, (req, res) => {
  // Construct the enlay event
  const {
    data: { promotable },
  } = enlay.webhooks.constructEvent<Events.GetPromotablesPayload>(req.body);

  // Get the advertiser email (other fields are available)
  const { email } = promotable.advertiser;

  // Fetch the user
  const user = await knex("users")
    .select("*")
    .where({
      email,
    })
    .first();
  if (!user) {
    return res.json([]);
  }

  // Fetch the users products in specific format
  const products: Entities.PromotablePayload[] = await knex("products")
    .select(["id", "name as display_name"])
    .where({
      user_id: user.id,
    });

  return res.json(products);
});
```

### Frontend

#### Creating the client

Create the client without any parameters.

```typescript
// src/enlay/index.ts
import Enlay from "@enlay/node";

const enlay = new Enlay();

export default enlay;
```

#### Registering advertisement click

Clicks are one of the core parts of the analytics for advertisers.

```tsx
import React from "react";
import enlay from "../enlay";

// src/pages/products.ts
export default function Products() {
  const { data: products } = useProducts();
  const router = useRouter();

  return (
    <>
      {products.map((product) => (
        <Product
          product={product}
          onClick={async () => {
            // Fire a placement click async
            if (product.placementId) {
              enlay.registerClick(product.placementId);
            }
            router.push(`/products/${product.id}`);
          }}
        />
      ))}
    </>
  );
}
```

#### Registering advertisement view

Views are also core for advertisers as these are true impressions.

```tsx
import React, { useEffect } from "react";
import enlay from "../enlay";

// src/pages/products.ts
export default function Products() {
  const { data: products } = useProducts();
  const router = useRouter();

  // Register views on all the products on first render
  useEffect(() => {
    async function registerView() {
      await enlay.registerView(
        products
          .filter((product) => !!p.placementId)
          .map((product) => product.placementId)
      );
    }

    registerView();
  }, []);

  return (
    <>
      {products.map((product) => (
        <Product product={product} />
      ))}
    </>
  );
}
```
