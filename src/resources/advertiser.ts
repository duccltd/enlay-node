import { client } from "../client";
import { Advertiser } from "../entities";
import { Paginated, PerformanceQuery, QueryList, RequiredAttrs } from "../util";

async function createAdvertiser(payload: Pick<Advertiser, "discordId" | "email">): Promise<Advertiser> {
    const { data } = await client.request({
        method: "POST",
        url: "/advertisers",
        data: payload,
    });

    return data;
}

async function getAdvertiser(advertiserId: string): Promise<Advertiser> {
    const { data } = await client.request({
        method: "GET",
        url: `/advertisers/${advertiserId}`,
    });

    return data;
}

async function listAdvertisers(query: RequiredAttrs<Partial<QueryList>, "limit">): Promise<Paginated<Advertiser>> {
    const { data } = await client.request({
        method: "GET",
        url: `/advertisers`,
        params: query,
    });

    return data;
}

async function getAdvertiserBalance(advertiserId: string): Promise<{ amount: number }> {
    const { data } = await client.request({
        method: "GET",
        url: `/advertisers/${advertiserId}/balance`,
    });

    return data;
}

async function getAdvertiserPerformance(advertiserId: string, query: PerformanceQuery): Promise<any> {
    const { data } = await client.request({
        method: "GET",
        url: `/advertisers/${advertiserId}/performance`,
        params: query,
    });

    return data;
}

export {
    createAdvertiser,
    getAdvertiser,
    listAdvertisers,
    getAdvertiserBalance,
    getAdvertiserPerformance,
}