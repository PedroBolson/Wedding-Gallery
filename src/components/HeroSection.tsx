import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Sparkles, UploadCloud, ImageIcon } from 'lucide-react';
import type { Photo } from '../types';

interface HeroSectionProps {
    onUpload: () => void;
    highlightPhotos: Photo[];
}

export const HeroSection = ({ onUpload, highlightPhotos }: HeroSectionProps) => {

    const [activeHighlight, setActiveHighlight] = useState(0);

    useEffect(() => {
        if (highlightPhotos.length <= 1) return;
        const interval = setInterval(() => {
            setActiveHighlight((prev) => (prev + 1) % highlightPhotos.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [highlightPhotos.length]);

    const featuredPhoto = highlightPhotos[activeHighlight];

    return (
        <section className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_top,#fff1ed,#fff7ef,#fdfcfa)] p-8 shadow-[0_20px_120px_rgba(255,143,119,0.2)] sm:p-12">
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="pointer-events-none absolute -right-12 top-10 h-48 w-48 rounded-full bg-[#ffdcd6] blur-3xl" />
                <div className="pointer-events-none absolute -left-12 bottom-6 h-56 w-56 rounded-full bg-[#ffe9d1] blur-3xl" />
            </motion.div>

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-stretch">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-[#d06d5b]">
                        <Sparkles className="h-4 w-4" />
                        Celebração viva
                    </div>
                    <motion.h2
                        className="text-4xl font-serif text-[#2d302d] sm:text-5xl"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        Marina &amp; Pedro — memórias compartilhadas
                    </motion.h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/70 bg-white/60 p-5 backdrop-blur-xl">
                            <div className="flex items-center gap-2 text-[#d06d5b]">
                                <CalendarDays className="h-5 w-5" />
                                <span className="text-sm font-semibold uppercase tracking-[0.3em]">
                                    Data
                                </span>
                            </div>
                            <p className="mt-2 text-lg font-semibold text-[#2d302d]">
                                07 de Fevereiro, 2026
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/70 bg-white/60 p-5 backdrop-blur-xl">
                            <div className="flex items-center gap-2 text-[#d06d5b]">
                                <MapPin className="h-5 w-5" />
                                <span className="text-sm font-semibold uppercase tracking-[0.3em]">
                                    Local
                                </span>
                            </div>
                            <p className="mt-2 text-lg font-semibold text-[#2d302d]">
                                Nova Petrópolis / RS
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <motion.button
                            onClick={onUpload}
                            className="inline-flex items-center gap-2 rounded-2xl border border-[#f7cfc0] bg-white px-5 py-3 text-sm font-semibold text-[#c55f4c] shadow-sm hover:bg-[#fff5ef]"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <UploadCloud className="h-4 w-4" />
                            Compartilhar memórias
                        </motion.button>
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 rounded-[28px] border border-white/70 bg-white/70 p-6 backdrop-blur-xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#c47058]">
                        Panorama ao vivo
                    </p>
                    <div className="relative min-h-[260px] overflow-hidden rounded-[26px] border border-[#f5dfdc] bg-[#fff7f3]">
                        {featuredPhoto ? (
                            <>
                                <motion.img
                                    key={featuredPhoto.id}
                                    src={featuredPhoto.url}
                                    alt={featuredPhoto.uploaderName}
                                    className="h-full w-full object-cover"
                                    initial={{ opacity: 0.5, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/10 to-transparent p-5 text-white">
                                    <p className="text-sm uppercase tracking-[0.4em] text-white/80">
                                        Em destaque agora
                                    </p>
                                    <p className="text-lg font-semibold">{featuredPhoto.uploaderName}</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-[#b28c7d]">
                                <ImageIcon className="h-8 w-8" />
                                <p className="text-sm">
                                    As primeiras fotos enviadas aparecem aqui em destaque.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
