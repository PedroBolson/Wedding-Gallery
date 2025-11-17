import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { PhotoGrid } from '../components/PhotoGrid';
import { PhotoUpload } from '../components/PhotoUpload';
import { FloatingElements } from '../components/FloatingElements';
import { PhotoService } from '../services/photoService';
import { usePhotoStore } from '../store/photoStore';
import { useUserStore } from '../store/userStore';
import { UserService } from '../services/userService';
import { GuestInsights } from '../components/GuestInsights';
import type { User } from '../types';

export const Gallery = () => {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [guests, setGuests] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<'album' | 'insights'>('album');
    const photos = usePhotoStore((state) => state.photos);
    const setPhotos = usePhotoStore((state) => state.setPhotos);
    const user = useUserStore((state) => state.user);
    const isPrivileged = user?.role === 'noivo' || user?.role === 'autorizado';

    useEffect(() => {
        const unsubscribeGuests = UserService.subscribeToGuests((newGuests) => {
            setGuests(newGuests);
        });
        return () => unsubscribeGuests();
    }, []);

    useEffect(() => {
        if (!user) return;

        UserService.updateLastActive(user.id);
        const unsubscribePhotos = PhotoService.subscribeToPhotos(setPhotos);

        return () => unsubscribePhotos();
    }, [user, setPhotos]);

    const hasPhotos = photos.length > 0;
    const highlightPhotos = useMemo(() => photos.slice(0, 6), [photos]);

    const emptyState = (
        <motion.div
            className="mx-auto flex max-w-2xl flex-col items-center rounded-[32px] border border-white/70 bg-white/80 p-10 text-center shadow-[0_20px_80px_rgba(84,36,23,0.12)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-[#fff3ef]">
                <ImageOff className="h-16 w-16 text-[#f07b7f]" strokeWidth={1.4} />
            </div>
            <h3 className="text-3xl font-serif text-[#2f3430]">Ainda sem registros</h3>
            <p className="mt-3 text-sm text-[#6a716a]">
                Seja o primeiro a eternizar este dia. As fotos aparecem aqui imediatamente após o
                upload e todos podem baixar na melhor resolução.
            </p>
            <motion.button
                onClick={() => setIsUploadOpen(true)}
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#f7cfc0] bg-white px-8 py-4 text-sm font-semibold text-[#c55f4c] shadow-sm hover:bg-[#fff5ef]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                Adicionar primeira foto
            </motion.button>
        </motion.div>
    );

    const tabs = useMemo(
        () => [
            { id: 'album' as const, label: 'Álbum ao vivo' },
            { id: 'insights' as const, label: 'Convidados & insights' },
        ],
        []
    );

    return (
        <div className="relative min-h-screen bg-[#fffaf6]">
            <FloatingElements />
            <Header onUploadClick={() => setIsUploadOpen(true)} photoCount={photos.length} />

            <main className="relative mx-auto flex max-w-6xl flex-col gap-10 pb-12">
                <HeroSection
                    onUpload={() => setIsUploadOpen(true)}
                    highlightPhotos={highlightPhotos}
                />

                {isPrivileged && (
                    <div className="flex gap-2 self-center rounded-2xl border border-[#f4dedd] bg-white/70 p-1 shadow-inner">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                    activeTab === tab.id
                                        ? 'bg-[#ffede6] text-[#c96a59] shadow'
                                        : 'text-[#8b918b]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {(!isPrivileged || activeTab === 'album') && (
                    <section className="px-2 sm:px-0">
                        {hasPhotos ? <PhotoGrid photos={photos} /> : emptyState}
                    </section>
                )}

                {isPrivileged && activeTab === 'insights' && (
                    <GuestInsights users={guests} totalPhotos={photos.length} />
                )}
            </main>

            <PhotoUpload isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </div>
    );
};
