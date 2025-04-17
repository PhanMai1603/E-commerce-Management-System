// Example Role interface with permissions field
export interface Role {
    id: string;
    name: string;
    permissions: Record<string, Record<string, Record<string, boolean>>>; // Permissions format
  }
  

export interface RoleResponse {
    totalRoles: number;
    totalPages: number;
    roles: Role[];
}

export interface RoleData {
    name?: string; 
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