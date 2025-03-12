export interface Role {
    id: string;
    name: string;
}

export interface RoleResponse {
    totalRoles: number;
    totalPages: number;
    roles: Role[];
}
