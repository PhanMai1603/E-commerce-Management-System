export interface CategoryDataResponse {
    id: string;
    name: string;
    parentId: string | null;
    children: CategoryDataResponse[];
}
