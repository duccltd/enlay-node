import { client } from "../client";
import { Transaction } from "../entities";
import { Paginated, QueryList, RequiredAttrs } from "../util";

async function listTransactions(query: RequiredAttrs<Partial<QueryList>, "limit"> & Partial<Pick<Transaction, "type" | "advertiser_id" | "slot_id" | "advertisement_id">>): Promise<Paginated<Transaction>> {
    const { data } = await client.request({
        method: "GET",
        url: `/transactions?${new URLSearchParams(query as any).toString()}`,
    });

    return data;
}

export {
    listTransactions,
}