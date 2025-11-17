import {
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User, UserRole } from '../types';

const USERS_COLLECTION = 'users';
const DEFAULT_ROLE: UserRole = 'convidado';

export interface SignInResult {
    user: User;
    isReturning: boolean;
}

export interface SimilarUserError extends Error {
    code: 'existing-user-suggestion';
    suggestions: User[];
}

const normalizeString = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ');

const formatName = (value: string) =>
    value
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
        .join(' ');

const mapUserData = (id: string, data: Record<string, any>): User => ({
    id,
    name: data.name,
    nickname: data.nickname || undefined,
    role: (data.role as UserRole) || DEFAULT_ROLE,
    createdAt: data.createdAt?.toDate() || new Date(),
    lastActive: data.lastActive?.toDate() || new Date(),
    photoCount: data.photoCount ?? 0,
    lastUploadAt: data.lastUploadAt?.toDate() ?? null,
});

const levenshteinDistance = (a: string, b: string): number => {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i += 1) {
        for (let j = 1; j <= b.length; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
};

export class UserService {
    static async signInWithName(name: string, nickname?: string): Promise<SignInResult> {
        const trimmedName = formatName(name);
        const normalizedName = normalizeString(trimmedName);
        const trimmedNickname = nickname?.trim();

        const existingQuery = query(
            collection(db, USERS_COLLECTION),
            where('normalizedName', '==', normalizedName),
            limit(1)
        );

        let existingSnapshot = await getDocs(existingQuery);

        if (existingSnapshot.empty) {
            const legacyQuery = query(
                collection(db, USERS_COLLECTION),
                where('name', '==', trimmedName),
                limit(1)
            );
            existingSnapshot = await getDocs(legacyQuery);
        }

        if (!existingSnapshot.empty) {
            const docSnap = existingSnapshot.docs[0];
            const docRef = doc(db, USERS_COLLECTION, docSnap.id);
            const updates: Record<string, unknown> = {
                lastActive: serverTimestamp(),
            };

            const shouldUpdateNickname =
                trimmedNickname &&
                (!docSnap.data().nickname || docSnap.data().nickname !== trimmedNickname);

            if (shouldUpdateNickname) {
                updates.nickname = trimmedNickname;
            }

            await updateDoc(docRef, updates);

            const mappedUser = mapUserData(docSnap.id, docSnap.data());
            const mergedUser: User = {
                ...mappedUser,
                lastActive: new Date(),
                nickname: shouldUpdateNickname ? trimmedNickname : mappedUser.nickname,
            };

            return {
                user: mergedUser,
                isReturning: true,
            };
        }

        const similarUsers = await this.findSimilarUsers(normalizedName);

        if (similarUsers.length > 0) {
            const suggestionError: SimilarUserError = new Error(
                'Encontramos registros parecidos com este nome'
            ) as SimilarUserError;
            suggestionError.code = 'existing-user-suggestion';
            suggestionError.suggestions = similarUsers;
            throw suggestionError;
        }

        const userId = crypto.randomUUID();
        const newUser: User = {
            id: userId,
            name: trimmedName,
            nickname: trimmedNickname || undefined,
            role: DEFAULT_ROLE,
            createdAt: new Date(),
            lastActive: new Date(),
            photoCount: 0,
            lastUploadAt: null,
        };

        await setDoc(doc(db, USERS_COLLECTION, userId), {
            ...newUser,
            nickname: trimmedNickname || null,
            normalizedName,
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp(),
            lastUploadAt: null,
        });

        return { user: newUser, isReturning: false };
    }

    static async getUser(userId: string): Promise<User | null> {
        const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
        if (!userDoc.exists()) {
            return null;
        }

        return mapUserData(userDoc.id, userDoc.data());
    }

    static subscribeToGuests(callback: (users: User[]) => void): () => void {
        const usersQuery = query(
            collection(db, USERS_COLLECTION),
            orderBy('name', 'asc')
        );

        return onSnapshot(usersQuery, (snapshot) => {
            const guests = snapshot.docs.map((doc) => mapUserData(doc.id, doc.data()));
            callback(guests);
        });
    }

    static async updateLastActive(userId: string): Promise<void> {
        await updateDoc(doc(db, USERS_COLLECTION, userId), {
            lastActive: serverTimestamp(),
        }).catch(() => {
            /* noop - doc might not exist yet */
        });
    }

    static async incrementPhotoCount(userId: string): Promise<void> {
        await updateDoc(doc(db, USERS_COLLECTION, userId), {
            photoCount: increment(1),
            lastUploadAt: serverTimestamp(),
        }).catch(() => {
            /* noop */
        });
    }

    static async authenticateExistingUser(userId: string, nickname?: string): Promise<User> {
        const trimmedNickname = nickname?.trim();
        const updates: Record<string, unknown> = {
            lastActive: serverTimestamp(),
        };

        if (trimmedNickname) {
            updates.nickname = trimmedNickname;
        }

        const userRef = doc(db, USERS_COLLECTION, userId);
        await updateDoc(userRef, updates);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error('Usuário não encontrado para autenticação');
        }

        return mapUserData(userDoc.id, userDoc.data());
    }

    private static async findSimilarUsers(normalizedName: string): Promise<User[]> {
        const snapshot = await getDocs(collection(db, USERS_COLLECTION));

        return snapshot.docs
            .map((docItem) => ({
                user: mapUserData(docItem.id, docItem.data()),
                normalized: docItem.data().normalizedName || normalizeString(docItem.data().name),
            }))
            .filter(
                ({ normalized }) =>
                    levenshteinDistance(normalizedName, normalized) > 0 &&
                    levenshteinDistance(normalizedName, normalized) <= 2
            )
            .map(({ user }) => user);
    }
}

export { DEFAULT_ROLE };
