export interface CategoryDataResponse {
    id: string;
    name: string;
    parentId: string | null;
    children: CategoryDataResponse[];
}

export interface CategoryData {
    name: string,
    parentId: null | string,
}