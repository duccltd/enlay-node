import { client } from "../client";
import { Placement, Slot } from "../entities";
import { PerformanceQuery, QueryList, RequiredAttrs } from "../util";

async function createSlot(payload: Pick<Slot, "name" | "description" | "website" | "categoryId" | "userId" | "customFields">): Promise<Slot> {
    const { data } = await client.request({
        method: "POST",
        url: "/slots",
        data: payload,
    });

    return data;
}

async function updateSlot(slotId: string, payload: Pick<Slot, "name" | "description" | "website" | "categoryId" | "userId" | "customFields">): Promise<Slot> {
    const { data } = await client.request({
        method: "PATCH",
        url: `/slots/${slotId}`,
        data: payload,
    });

    return data;
}

async function getSlot(slotId: string): Promise<Slot> {
    const { data } = await client.request({
        method: "GET",
        url: `/slots/${slotId}`,
    });

    return data;
}

async function listSlots(query: RequiredAttrs<Partial<QueryList>, "limit"> & Partial<Pick<Slot, "status" | "categoryId">>): Promise<Slot[]> {
    const { data } = await client.request({
        method: "GET",
        url: `/slots`,
        params: query,
    });

    return data;
}

async function getSlotPerformance(slotId: string, query: PerformanceQuery): Promise<any> {
    const { data } = await client.request({
        method: "GET",
        url: `/slots/${slotId}/performance`,
        params: query,
    });

    return data;
}

async function createPlacements(slotId: string, payload: {
    max: number;
    unique: boolean;
}): Promise<Placement[]> {
    const { data } = await client.request({
        method: "POST",
        url: `/slots/${slotId}/placements`,
        data: payload,
    });

    return data;
}

export {
    createSlot,
    updateSlot,
    getSlot,
    listSlots,
    getSlotPerformance,
    createPlacements,
}