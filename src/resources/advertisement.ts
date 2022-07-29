import { client } from "../client";
import { Advertisement } from "../entities";
import { Paginated, PerformanceQuery, QueryList, RequiredAttrs } from "../util";

async function createAdvertisement(payload: Pick<Advertisement, "name" | "description" | "redirectUrl" | "imageUrl" | "dailyBudget" | "customFields" | "slotId" | "advertiserId">): Promise<Advertisement> {
    const { data } = await client.request({
        method: "POST",
        url: "/advertisements",
        data: payload,
    });

    return data;
}

async function updateAdvertisement(advertisementId: string, payload: Pick<Advertisement, "name" | "description" | "redirectUrl" | "imageUrl" | "dailyBudget" | "customFields" | "slotId" | "advertiserId">): Promise<Advertisement> {
    const { data } = await client.request({
        method: "PATCH",
        url: `/advertisements/${advertisementId}`,
        data: payload,
    });

    return data;
}

async function getAdvertisement(advertisementId: string): Promise<Advertisement> {
    const { data } = await client.request({
        method: "GET",
        url: `/advertisements/${advertisementId}`,
    });

    return data;
}

async function listAdvertisements(query: RequiredAttrs<Partial<QueryList>, "limit"> & Partial<Pick<Advertisement, "advertiserId" | "slotId" | "status" | "approvalStatus">>): Promise<Paginated<Advertisement>> {
    const { data } = await client.request({
        method: "GET",
        url: `/advertisements`,
        params: query,
    });

    return data;
}

async function getAdvertisementPerformance(advertisementId: string, query: PerformanceQuery): Promise<any> {
    const { data } = await client.request({
        method: "GET",
        url: `/advertisements/${advertisementId}/performance`,
        params: query,
    });

    return data;
}

export {
    createAdvertisement,
    updateAdvertisement,
    getAdvertisement,
    listAdvertisements,
    getAdvertisementPerformance,
}