export type UserRole = 'convidado' | 'noivo' | 'autorizado';

export interface User {
    id: string;
    name: string;
    nickname?: string;
    role: UserRole;
    createdAt: Date;
    lastActive: Date;
    photoCount: number;
    lastUploadAt: Date | null;
}

export interface Photo {
    id: string;
    url: string;
    thumbnailUrl?: string;
    uploadedBy: string;
    uploaderName: string;
    uploaderRole?: UserRole;
    uploadedAt: Date;
    caption?: string;
    likes: number;
    likedBy: string[];
    width?: number;
    height?: number;
}

export interface UploadProgress {
    id: string;
    fileName: string;
    progress: number;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    error?: string;
}
