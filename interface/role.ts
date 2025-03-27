export interface Role {
    id: string;
    name: string;
}

export interface RoleResponse {
    totalRoles: number;
    totalPages: number;
    roles: Role[];
}

export interface RoleData {
    name: string;
    permissions: {
        [types: string]: {
            [entity: string]: {
                [action: string]: boolean;
            };
        };
    };
}
export interface RoleDetailResponse {
    id: string;
    name: string;
    permissions: {
        [types: string]: {
            [entity: string]: {
                [action: string]: boolean;
            };
        };
    };    
}