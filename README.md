# enlay-node

JavaScript library for the Enlay API.

## Installation

### Yarn

```sh-session
yarn add @enlay/node
```

### NPM

```sh-session
npm install @enlay/node
```

## Usage

To be fully integrated with Enlay, we have composed a list of actionables below. These are essential for your integration to work. Currently, there are two implementations required, one for the backend and one for the frontend. On the backend we handle user product fetching and generating advertisement placements. Meanwhile, on the frontend, we register clicks and views of those products..

### Backend

#### Creating the enlay client

You should not expose the Enlay client with your token to the user. You can find your token on the [publisher dashboard](https://publisher.enlay.io/publisher).

```ts
// src/enlay/index.ts
import Enlay from "@enlay/node";

const enlay = new Enlay({
  apiToken: "ey5ab...",
});

export default enlay;
```

#### Fetching advertisement placements

A placement is an advertisement which is currently running. There are a few options you can provide to create placements to fit your own use case but in this example we fetch 2 unique on-going advertisements. From these placements, you can then extract your related resource ID through the custom fields as shown in the real world example.

The `slot-id` can be found on your [publisher dashboard](https://publisher.enlay.io/publisher).

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

**Real world advanced example** with data using knex.
Typically, you might have another route to fetch sponsored products or an additional query param such as `/products?sponsored=true`. Although, in this example, it shows how you would attach sponsored products in with a regular product serving.

```ts
// src/products.ts
import enlay from "./enlay";

app.get(`/products`, (req, res) => {
  const products = await knex("products").select("*").limit(20);

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
    const placement = data.createPlacements.find(
      (placement) => placement.advertisement.customFields.id === product.id
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

This endpoint is needed so we know what products an advertiser can sponsor on your platform. This will then be used when advertisers visit the whitelabelled Enlay platform to pick and choose which advertisement they want to promote.

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

#### Creating the enlay client

Create the client without any options. This is **safe** to share as it does not have the API token attached.

```typescript
// src/enlay/index.ts
import Enlay from "@enlay/node";

const enlay = new Enlay();

export default enlay;
```

#### Registering advertisement click

Clicks are one of the core parts of the analytics for advertisers. In this example, it fires off a click on a product to enlay asynchronously.

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
          onClick={() => {
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

#### (Optional) Registering advertisement view

Views are also core for advertisers as these are true impressions. In this example, on initial mount, we are registering views on all rendered products. This gives an advertiser and publisher insights on true impressions on products. In the future we hope to add more such as registering views when a product is scrolled into view etc.

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
