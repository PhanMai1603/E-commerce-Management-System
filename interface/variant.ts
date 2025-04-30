export interface PublishVariantResponse {
    variant: {
        id: string,
        name: string,
        slug: string,
        status: string,
    }
}

export interface PublishAllVariantResponse {
    acknowledged: boolean,
    modifiedCount: number,
    upsertedId: string | null,
    upsertedCount: number,
    matchedCount: number,
}