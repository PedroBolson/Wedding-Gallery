import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    deleteDoc,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Photo, UserRole } from '../types';
import { UserService } from './userService';

const PHOTOS_COLLECTION = 'photos';
const STORAGE_PATH = 'wedding-photos';

const getImageDimensions = (file: File): Promise<{ width?: number; height?: number }> => {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(url);
        };
        img.onerror = () => {
            resolve({ width: undefined, height: undefined });
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });
};

export class PhotoService {
    static async uploadPhoto(
        file: File,
        userId: string,
        userName: string,
        userRole: UserRole,
        onProgress: (progress: number) => void
    ): Promise<Photo> {
        const photoId = crypto.randomUUID();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${photoId}.${fileExtension}`;
        const storagePath = `${STORAGE_PATH}/${fileName}`;

        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file, {
            contentType: file.type || 'application/octet-stream',
            customMetadata: {
                uploadedBy: userId,
                uploaderName: userName,
                uploaderRole: userRole,
            },
        });

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress(progress);
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                        const { width, height } = await getImageDimensions(file);

                        const photoData: Photo = {
                            id: photoId,
                            url: downloadURL,
                            uploadedBy: userId,
                            uploaderName: userName,
                            uploaderRole: userRole,
                            uploadedAt: new Date(),
                            likes: 0,
                            likedBy: [],
                            width,
                            height,
                        };

                        await setDoc(doc(db, PHOTOS_COLLECTION, photoId), {
                            ...photoData,
                            uploadedAt: serverTimestamp(),
                        });

                        await UserService.incrementPhotoCount(userId);

                        resolve(photoData);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    static async getPhotos(): Promise<Photo[]> {
        const photosQuery = query(
            collection(db, PHOTOS_COLLECTION),
            orderBy('uploadedAt', 'desc')
        );

        const snapshot = await getDocs(photosQuery);
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                url: data.url,
                thumbnailUrl: data.thumbnailUrl,
                uploadedBy: data.uploadedBy,
                uploaderName: data.uploaderName,
                uploaderRole: data.uploaderRole || 'convidado',
                uploadedAt: data.uploadedAt?.toDate() || new Date(),
                caption: data.caption,
                likes: data.likes || 0,
                likedBy: data.likedBy || [],
                width: data.width,
                height: data.height,
            };
        });
    }

    static subscribeToPhotos(callback: (photos: Photo[]) => void): () => void {
        const photosQuery = query(
            collection(db, PHOTOS_COLLECTION),
            orderBy('uploadedAt', 'desc')
        );

        return onSnapshot(photosQuery, (snapshot) => {
            const photos = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    url: data.url,
                    thumbnailUrl: data.thumbnailUrl,
                    uploadedBy: data.uploadedBy,
                    uploaderName: data.uploaderName,
                    uploaderRole: data.uploaderRole || 'convidado',
                    uploadedAt: data.uploadedAt?.toDate() || new Date(),
                    caption: data.caption,
                    likes: data.likes || 0,
                    likedBy: data.likedBy || [],
                    width: data.width,
                    height: data.height,
                };
            });
            callback(photos);
        });
    }

    static async toggleLike(photoId: string, userId: string): Promise<void> {
        const photoRef = doc(db, PHOTOS_COLLECTION, photoId);
        const photoDoc = await getDoc(photoRef);

        if (!photoDoc.exists()) {
            throw new Error('Photo not found');
        }

        const data = photoDoc.data();
        const likedBy = data.likedBy || [];
        const isLiked = likedBy.includes(userId);

        await updateDoc(photoRef, {
            likes: increment(isLiked ? -1 : 1),
            likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId),
        });
    }

    static async deletePhoto(photoId: string, url: string): Promise<void> {
        const photoRef = ref(storage, url);
        await deleteObject(photoRef);
        await deleteDoc(doc(db, PHOTOS_COLLECTION, photoId));
    }

    static async downloadPhoto(url: string, fileName: string): Promise<void> {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
