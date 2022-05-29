import { client } from "../client";

/**
 * 
 * @param formData Must have a KV pair with "file": ----
 * @returns 
 */
async function createImage(formData: FormData): Promise<{
    url: string;
}> {
    const { data } = await client.request({
        method: "POST",
        url: "/images",
        data: formData,
    });

    return data;
}

export {
    createImage,
}