export interface getAllConversations{
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: boolean,
    items: Conversations[]
}

export interface Conversations{
    id: string,
    user :{
        id: string,
        name: string,
        avatar: string
    }
    latestMessage: {
        id: string,
        sender: string,
        userId: {
            id: string,
            name: string,
            avatar: string,
        }
        content: string,
        image: string,
        seen: boolean,
        createdAt: string,
    }

}

export interface getMessage{
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: true,
    items: Content[]
}

export interface Content{
    id: string,
    sender: string,
    userId: {
        id: string,
        name: string,
        avatar: string,
    } | null,
    senderType: string,
    content: string,
    image: string | null,
    seen: boolean,
    createdAt: string,
    position: boolean,
}


export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export interface PostMessage {
  content: string;
  imageUrls: string[];
  useAI: boolean;
  role: Role.ADMIN; 
}

export interface Seen {
    acknowledged: true,
    modifiedCount: number,
    upsertedId: null,
    upsertedCount: number,
    matchedCount: number,
}

export interface syncQdrant{
    status: string,
    documentCount: number,
}
