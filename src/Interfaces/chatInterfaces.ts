export interface User {
    _id: number,
    name: string,
    email: string,
    phone?: string,
}

export interface SideBar {
    collapsed: boolean,
    users: Chat[],
    currentUser: User,
    isOnline: boolean,
}

export interface Chat {
    _id: string | number,
    uid?: number,
    groupName?: string,
    creatorName: string,
    creatorEmail?: string,
    creatorPhone?: string,
    members: User[]
    createdAt: Date,
    updatedAt: Date,
}

export interface SignUpUser {
    user: User
}