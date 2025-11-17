import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Heart, User2, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PhotoService } from '../services/photoService';
import { useUserStore } from '../store/userStore';
import { RoleBadge } from './RoleBadge';
import type { Photo } from '../types';

interface PhotoGridProps {
    photos: Photo[];
}

export const PhotoGrid = ({ photos }: PhotoGridProps) => {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const user = useUserStore((state) => state.user);
    const currentUserId = user?.id;

    const groupedPhotos = useMemo(
        () =>
            photos.map((photo, index) => ({
                ...photo,
                delay: index * 0.04,
            })),
        [photos]
    );

    const handleLike = async (photoId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUserId) return;
        await PhotoService.toggleLike(photoId, currentUserId);
    };

    const handleDownload = async (photo: Photo, e: React.MouseEvent) => {
        e.stopPropagation();
        await PhotoService.downloadPhoto(
            photo.url,
            `casamento-marina-pedro-${photo.id}.jpg`
        );
    };

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        if (selectedPhoto) {
            html.classList.add('lock-scroll');
            body.classList.add('lock-scroll');
        } else {
            html.classList.remove('lock-scroll');
            body.classList.remove('lock-scroll');
        }
        return () => {
            html.classList.remove('lock-scroll');
            body.classList.remove('lock-scroll');
        };
    }, [selectedPhoto]);

    return (
        <>
            <div className="columns-1 gap-5 px-4 sm:columns-2 lg:columns-3">
                {groupedPhotos.map((photo) => (
                    <motion.article
                        key={photo.id}
                        className="mb-5 break-inside-avoid relative cursor-pointer overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_20px_80px_rgba(84,36,23,0.08)]"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: photo.delay }}
                        onClick={() => setSelectedPhoto(photo)}
                    >
                        <div
                            className="relative w-full overflow-hidden rounded-[28px]"
                            style={{
                                aspectRatio:
                                    photo.width && photo.height
                                        ? `${photo.width} / ${photo.height}`
                                        : '3 / 4',
                            }}
                        >
                            <img
                                src={photo.url}
                                alt={`Foto enviada por ${photo.uploaderName}`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0f0d0c]/85 via-transparent to-transparent opacity-100" />
                        </div>

                        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-5 pb-5 text-white">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold flex items-center gap-2">
                                        <User2 className="h-4 w-4" />
                                        {photo.uploaderName}
                                    </p>
                                    <RoleBadge role={photo.uploaderRole || 'convidado'} size="sm" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        onClick={(e) => handleLike(photo.id, e)}
                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${currentUserId && photo.likedBy.includes(currentUserId)
                                            ? 'bg-white/90 text-[#c9584c]'
                                            : 'bg-white/30 text-white hover:bg-white/40'
                                            }`}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${currentUserId && photo.likedBy.includes(currentUserId)
                                                ? 'fill-[#c9584c] text-[#c9584c]'
                                                : ''
                                                }`}
                                        />
                                        {photo.likes}
                                    </motion.button>
                                    <motion.button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(photo, e);
                                        }}
                                        className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
                                        title="Baixar esta foto"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Download className="h-4 w-4" />
                                        Baixar
                                    </motion.button>
                                </div>
                            </div>
                            <p className="text-xs text-white/70">
                                {format(photo.uploadedAt, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </p>
                        </div>
                    </motion.article>
                ))}
            </div>

            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        className="fixed inset-0 z-500 flex items-center justify-center bg-black/35 p-4 backdrop-blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.div
                            className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:h-[90vh] sm:rounded-[36px]"
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedPhoto(null)}
                                className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-[#2f3430] shadow"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <div className="shrink-0 bg-[#fef9f6] p-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-lg font-semibold text-[#2f3430]">
                                            {selectedPhoto.uploaderName}
                                        </p>
                                        <p className="text-sm text-[#808680]">
                                            {format(selectedPhoto.uploadedAt, "d 'de' MMMM 'às' HH:mm", {
                                                locale: ptBR,
                                            })}
                                        </p>
                                    </div>
                                    <RoleBadge role={selectedPhoto.uploaderRole || 'convidado'} />
                                </div>
                            </div>

                            <div className="flex flex-1 min-h-0 items-center justify-center bg-[#fef9f6] overflow-auto">
                                <img
                                    src={selectedPhoto.url}
                                    alt={selectedPhoto.uploaderName}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>

                            <div className="shrink-0 flex flex-wrap items-center justify-between gap-4 bg-white px-4 py-4 sm:px-6 sm:py-5">
                                <motion.button
                                    onClick={(e) => handleLike(selectedPhoto.id, e)}
                                    className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-inner ${currentUserId && selectedPhoto.likedBy.includes(currentUserId)
                                        ? 'bg-[#fee7e4] text-[#c9584c]'
                                        : 'bg-[#f7f7f7] text-[#2f3430]'
                                        }`}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Heart
                                        className={`h-5 w-5 ${currentUserId && selectedPhoto.likedBy.includes(currentUserId)
                                            ? 'fill-[#c9584c] text-[#c9584c]'
                                            : ''
                                            }`}
                                    />
                                    {selectedPhoto.likes} curtidas
                                </motion.button>
                                <motion.button
                                    onClick={(e) => handleDownload(selectedPhoto, e)}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-[#f7cfc0] bg-white px-5 py-3 text-sm font-semibold text-[#c55f4c] shadow-sm hover:bg-[#fff5ef]"
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Download className="h-4 w-4" />
                                    Baixar foto
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
