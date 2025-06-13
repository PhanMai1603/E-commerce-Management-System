export interface UserData {
    id: string;      
    name: string;    
    email: string;   
    status: string;  
    role: UserRole;   
}

export interface UserRole {
    id: string;
    name: string;
}

export interface UserDataResponse {
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: false,
    items: UserData[];
}


export interface ChangeData{
    oldPassword: string;
    newPassword: string;
}

// ROLE//
export interface RoleResponse{
    id: string;  
    role: UserRole[];
}



