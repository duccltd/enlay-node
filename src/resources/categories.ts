import { client } from "../client";
import { Category } from "../entities";

async function createCategory(payload: Pick<Category, "name" | "description" | "approvalMode" | "creationType" | "creationMode">): Promise<Category> {
    const { data } = await client.request({
        method: "POST",
        url: "/categories",
        data: payload,
    });

    return data;
}

async function updateCategory(categoryId: string, payload: Pick<Category, "name" | "description" | "approvalMode" | "creationType" | "creationMode">): Promise<Category> {
    const { data } = await client.request({
        method: "PATCH",
        url: `/categories/${categoryId}`,
        data: payload,
    });

    return data;
}

async function getCategory(categoryId: string): Promise<Category> {
    const { data } = await client.request({
        method: "GET",
        url: `/categories/${categoryId}`,
    });

    return data;
}

async function listCategories(): Promise<Category[]> {
    const { data } = await client.request({
        method: "GET",
        url: `/categories`,
    });

    return data;
}

export {
    createCategory,
    updateCategory,
    getCategory,
    listCategories,
}