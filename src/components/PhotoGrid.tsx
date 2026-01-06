import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Heart, User2, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PhotoService } from '../services/photoService';
import { useUserStore } from '../store/userStore';
import { RoleBadge } from './RoleBadge';
import { useToastStore } from './Toast';
import type { Photo } from '../types';

interface PhotoGridProps {
    photos: Photo[];
    viewMode?: 'masonry' | 'grid';
}

export const PhotoGrid = ({ photos, viewMode = 'masonry' }: PhotoGridProps) => {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const user = useUserStore((state) => state.user);
    const currentUserId = user?.id;
    const addToast = useToastStore((state) => state.addToast);

    const groupedPhotos = useMemo(
        () =>
            photos.map((photo, index) => ({
                ...photo,
                delay: viewMode === 'grid' ? 0 : (index < 12 ? 0 : (index - 12) * 0.02),
                priority: index < 12,
            })),
        [photos, viewMode]
    );

    const handleImageLoad = (photoId: string) => {
        setLoadedImages(prev => new Set(prev).add(photoId));
    };

    // Foto selecionada atualizada do store em tempo real
    const currentSelectedPhoto = useMemo(() => {
        if (!selectedPhoto) return null;
        return photos.find(p => p.id === selectedPhoto.id) || selectedPhoto;
    }, [selectedPhoto, photos]);

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

    const handleDelete = async (photo: Photo, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user || photo.uploadedBy !== user.id) {
            addToast('Você só pode deletar suas próprias fotos', 'error');
            return;
        }

        if (!confirm('Tem certeza que deseja deletar esta foto? Esta ação não pode ser desfeita.')) {
            return;
        }

        setDeletingPhotoId(photo.id);
        try {
            await PhotoService.deletePhoto(photo.id, photo.url, photo.uploadedBy);
            setSelectedPhoto(null);
            addToast('Foto deletada com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao deletar foto:', error);
            addToast('Erro ao deletar foto. Tente novamente.', 'error');
        } finally {
            setDeletingPhotoId(null);
        }
    };

    const isPhotoOwner = (photo: Photo) => {
        return user && photo.uploadedBy === user.id;
    };

    useEffect(() => {
        if (selectedPhoto) {
            // Salvar posição atual do scroll
            const scrollY = window.pageYOffset;
            setScrollPosition(scrollY);

            // Travar scroll mantendo posição
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
        } else {
            // Restaurar scroll
            const scrollY = scrollPosition;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
        };
    }, [selectedPhoto]);

    return (
        <>
            <AnimatePresence mode="wait">
                {viewMode === 'masonry' ? (
                    /* Layout Masonry - tamanhos variados */
                    <motion.div
                        key="masonry"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="columns-1 gap-5 px-4 sm:columns-2 lg:columns-3 xl:columns-4"
                    >
                        {groupedPhotos.map((photo) => {
                            const isLoaded = loadedImages.has(photo.id);

                            return (
                                <div key={photo.id} className="mb-5 break-inside-avoid">
                                    <motion.div
                                        className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_20px_80px_rgba(84,36,23,0.08)] transition-all duration-300 hover:shadow-[0_30px_100px_rgba(84,36,23,0.15)]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: photo.delay,
                                        }}
                                        whileHover={{ y: -4 }}
                                        onClick={() => setSelectedPhoto(photo)}
                                    >
                                        <div
                                            className="relative w-full overflow-hidden rounded-[28px] bg-linear-to-br from-[#f5f5f5] to-[#e8e8e8]"
                                            style={{
                                                aspectRatio:
                                                    photo.width && photo.height
                                                        ? `${photo.width} / ${photo.height}`
                                                        : '3 / 4',
                                            }}
                                        >
                                            {/* Skeleton loader */}
                                            {!isLoaded && (
                                                <div className="absolute inset-0 bg-[#f0f0f0]" />
                                            )}

                                            <img
                                                src={photo.url}
                                                alt={`Foto enviada por ${photo.uploaderName}`}
                                                className={`h-full w-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                                                loading={photo.priority ? 'eager' : 'lazy'}
                                                fetchPriority={photo.priority ? 'high' : 'auto'}
                                                onLoad={() => handleImageLoad(photo.id)}
                                            />

                                            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0f0d0c]/85 via-transparent to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-95" />
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-5 pb-5 text-white">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold flex items-center gap-2 truncate">
                                                        <User2 className="h-4 w-4 shrink-0" />
                                                        <span className="truncate">{photo.uploaderName}</span>
                                                    </p>
                                                    <RoleBadge role={photo.uploaderRole || 'convidado'} size="sm" />
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <motion.button
                                                        onClick={(e) => handleLike(photo.id, e)}
                                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${currentUserId && photo.likedBy.includes(currentUserId)
                                                            ? 'bg-white/90 text-[#c9584c]'
                                                            : 'bg-white/30 text-white hover:bg-white/50'
                                                            }`}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Heart
                                                            className={`h-4 w-4 ${currentUserId && photo.likedBy.includes(currentUserId)
                                                                ? 'fill-[#c9584c] text-[#c9584c]'
                                                                : ''
                                                                }`}
                                                        />
                                                        <span>{photo.likes}</span>
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownload(photo, e);
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/30 backdrop-blur-sm"
                                                        title="Baixar esta foto"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Baixar</span>
                                                    </motion.button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-white/70">
                                                {format(photo.uploadedAt, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </motion.div>
                ) : (
                    /* Layout Grid - quadrados compactos */
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="grid grid-cols-3 gap-2 px-4 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 lg:gap-4"
                    >
                        {groupedPhotos.map((photo) => {
                            const isLoaded = loadedImages.has(photo.id);

                            return (
                                <motion.div
                                    key={photo.id}
                                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0_8px_32px_rgba(84,36,23,0.06)]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: photo.delay,
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedPhoto(photo)}
                                >
                                    {/* Skeleton loader */}
                                    {!isLoaded && (
                                        <div className="absolute inset-0 bg-[#f0f0f0]" />
                                    )}

                                    <img
                                        src={photo.thumbnailUrl || photo.url}
                                        alt={`Foto de ${photo.uploaderName}`}
                                        className={`h-full w-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                                        loading="eager"
                                        fetchPriority="high"
                                        onLoad={() => handleImageLoad(photo.id)}
                                    />

                                    {/* Overlay com informações no hover */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                                        <p className="text-center text-xs font-semibold text-white line-clamp-2">
                                            {photo.uploaderName}
                                        </p>
                                        {photo.likes > 0 && (
                                            <div className="flex items-center gap-1 text-xs text-white">
                                                <Heart className="h-3 w-3 fill-white" />
                                                <span>{photo.likes}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {currentSelectedPhoto && (
                    <motion.div
                        className="fixed inset-0 z-500 flex items-center justify-center bg-black/35 p-4 backdrop-blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.div
                            className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:h-[90vh] sm:rounded-[36px]"
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.98, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
                                            {currentSelectedPhoto.uploaderName}
                                        </p>
                                        <p className="text-sm text-[#808680]">
                                            {format(currentSelectedPhoto.uploadedAt, "d 'de' MMMM 'às' HH:mm", {
                                                locale: ptBR,
                                            })}
                                        </p>
                                    </div>
                                    <RoleBadge role={currentSelectedPhoto.uploaderRole || 'convidado'} />
                                </div>
                            </div>

                            <div className="flex flex-1 min-h-0 items-center justify-center bg-[#fef9f6] overflow-auto">
                                <img
                                    src={currentSelectedPhoto.url}
                                    alt={currentSelectedPhoto.uploaderName}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>

                            <div className="shrink-0 flex flex-wrap items-center justify-between gap-4 bg-white px-4 py-4 sm:px-6 sm:py-5">
                                <motion.button
                                    onClick={(e) => handleLike(currentSelectedPhoto.id, e)}
                                    className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-inner ${currentUserId && currentSelectedPhoto.likedBy.includes(currentUserId)
                                        ? 'bg-[#fee7e4] text-[#c9584c]'
                                        : 'bg-[#f7f7f7] text-[#2f3430]'
                                        }`}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Heart
                                        className={`h-5 w-5 ${currentUserId && currentSelectedPhoto.likedBy.includes(currentUserId)
                                            ? 'fill-[#c9584c] text-[#c9584c]'
                                            : ''
                                            }`}
                                    />
                                    {currentSelectedPhoto.likes} curtidas
                                </motion.button>
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        onClick={(e) => handleDownload(currentSelectedPhoto, e)}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-[#f7cfc0] bg-white px-5 py-3 text-sm font-semibold text-[#c55f4c] shadow-sm hover:bg-[#fff5ef]"
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <Download className="h-4 w-4" />
                                        Baixar foto
                                    </motion.button>
                                    {isPhotoOwner(currentSelectedPhoto) && (
                                        <motion.button
                                            onClick={(e) => handleDelete(currentSelectedPhoto, e)}
                                            disabled={deletingPhotoId === currentSelectedPhoto.id}
                                            className="inline-flex items-center gap-2 rounded-2xl border border-red-300 bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileTap={{ scale: deletingPhotoId === currentSelectedPhoto.id ? 1 : 0.97 }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            {deletingPhotoId === currentSelectedPhoto.id ? 'Deletando...' : 'Deletar'}
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
