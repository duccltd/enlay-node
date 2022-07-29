import { client } from "../client";
import { Transaction } from "../entities";
import { Paginated, QueryList, RequiredAttrs } from "../util";

async function listTransactions(query: RequiredAttrs<Partial<QueryList>, "limit"> & Partial<Pick<Transaction, "type" | "advertiserId" | "slotId" | "advertisementId">>): Promise<Paginated<Transaction>> {
    const { data } = await client.request({
        method: "GET",
        url: `/transactions`,
        params: query,
    });

    return data;
}

export {
    listTransactions,
}