import { client } from "../client";

async function viewPlacements(placementIds: string[]): Promise<void> {
    const { data } = await client.request({
        method: "POST",
        url: "/p/v",
        data: placementIds.map(id => ({
            id
        })),
    });

    return data;
}

async function clickPlacement(placementId: string): Promise<any> {
    const response = await client.request({
        method: "GET",
        url: `/p/${placementId}/c`,
    });

    return response;
}

export {
    viewPlacements,
    clickPlacement,
}