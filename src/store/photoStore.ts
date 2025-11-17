import { create } from 'zustand';
import type { Photo, UploadProgress } from '../types';

interface PhotoState {
    photos: Photo[];
    uploadProgress: UploadProgress[];
    setPhotos: (photos: Photo[]) => void;
    addPhoto: (photo: Photo) => void;
    updatePhoto: (id: string, updates: Partial<Photo>) => void;
    deletePhoto: (id: string) => void;
    addUploadProgress: (progress: UploadProgress) => void;
    updateUploadProgress: (id: string, updates: Partial<UploadProgress>) => void;
    removeUploadProgress: (id: string) => void;
}

export const usePhotoStore = create<PhotoState>((set) => ({
    photos: [],
    uploadProgress: [],
    setPhotos: (photos) => set({ photos }),
    addPhoto: (photo) => set((state) => ({ photos: [photo, ...state.photos] })),
    updatePhoto: (id, updates) =>
        set((state) => ({
            photos: state.photos.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
    deletePhoto: (id) =>
        set((state) => ({
            photos: state.photos.filter((p) => p.id !== id),
        })),
    addUploadProgress: (progress) =>
        set((state) => ({
            uploadProgress: [...state.uploadProgress, progress],
        })),
    updateUploadProgress: (id, updates) =>
        set((state) => ({
            uploadProgress: state.uploadProgress.map((p) =>
                p.id === id ? { ...p, ...updates } : p
            ),
        })),
    removeUploadProgress: (id) =>
        set((state) => ({
            uploadProgress: state.uploadProgress.filter((p) => p.id !== id),
        })),
}));
