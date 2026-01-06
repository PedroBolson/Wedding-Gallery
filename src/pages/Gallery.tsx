import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Image, Users, UploadCloud, ImageOff, LayoutGrid, LayoutList, Filter, X } from 'lucide-react';
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

type PageType = 'live' | 'gallery' | 'insights';

export const Gallery = () => {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [guests, setGuests] = useState<User[]>([]);
    const [activePage, setActivePage] = useState<PageType>('live');
    const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry');
    const [filterPerson, setFilterPerson] = useState<string>('');
    const [sortBy, setSortBy] = useState<'recent' | 'likes' | 'oldest'>('recent');
    const [showFilters, setShowFilters] = useState(false);
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

    const highlightPhotos = useMemo(() => photos.slice(0, 6), [photos]);

    // Pessoas únicas para filtro
    const uniquePeople = useMemo(() => {
        const people = new Map<string, string>();
        photos.forEach(photo => {
            people.set(photo.uploadedBy, photo.uploaderName);
        });
        return Array.from(people.entries()).map(([id, name]) => ({ id, name }));
    }, [photos]);

    // Fotos filtradas e ordenadas
    const filteredPhotos = useMemo(() => {
        let filtered = [...photos];

        // Filtrar por pessoa
        if (filterPerson) {
            filtered = filtered.filter(photo => photo.uploadedBy === filterPerson);
        }

        // Ordenar
        if (sortBy === 'likes') {
            filtered.sort((a, b) => b.likes - a.likes);
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime());
        } else {
            // recent (padrão)
            filtered.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
        }

        return filtered;
    }, [photos, filterPerson, sortBy]);

    const navigationItems = useMemo(() => {
        const items = [
            { id: 'live' as PageType, label: 'Álbum ao vivo', shortLabel: 'Ao vivo', icon: Heart },
            { id: 'gallery' as PageType, label: 'Todas as fotos', shortLabel: 'Galeria', icon: Image, count: photos.length },
        ];

        if (isPrivileged) {
            items.push({ id: 'insights' as PageType, label: 'Convidados', shortLabel: 'Insights', icon: Users, count: guests.length });
        }

        return items;
    }, [isPrivileged, photos.length, guests.length]);

    const emptyState = (
        <motion.div
            className="mx-auto flex max-w-2xl flex-col items-center rounded-4xl border border-white/70 bg-white/80 p-10 text-center shadow-[0_20px_80px_rgba(84,36,23,0.12)] backdrop-blur-xl"
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

    return (
        <div className="relative min-h-screen bg-[#fffaf6]">
            <FloatingElements />
            <Header onUploadClick={() => setIsUploadOpen(true)} photoCount={photos.length} />

            {/* Mobile Navigation */}
            <div className="fixed top-[95px] left-0 right-0 z-45 bg-[#fffaf6]/95 backdrop-blur-xl border-b border-white/50 lg:hidden">
                <div className="flex justify-center gap-2 p-2.5">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActivePage(item.id)}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition shrink-0 ${activePage === item.id
                                ? 'bg-[#ffede6] text-[#c96a59] shadow-sm'
                                : 'text-[#8b918b] hover:bg-white/50'
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            <span className="text-[11px] sm:text-xs">{item.shortLabel || item.label}</span>
                            {item.count !== undefined && (
                                <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] leading-tight">
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Spacer for fixed nav */}
            <div className="h-15 lg:hidden" />

            <div className="lg:flex lg:gap-8 lg:px-8 lg:pt-8">
                {/* Desktop Sidebar Navigation */}
                <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-7rem)] lg:w-64 lg:shrink-0">
                    <nav className="space-y-2 rounded-3xl border border-white/70 bg-white/70 p-4 backdrop-blur-xl shadow-lg">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActivePage(item.id)}
                                className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activePage === item.id
                                    ? 'bg-[#ffede6] text-[#c96a59] shadow-sm'
                                    : 'text-[#6a716a] hover:bg-white/70'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </div>
                                {item.count !== undefined && (
                                    <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs">
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        ))}

                        <div className="pt-4">
                            <motion.button
                                onClick={() => setIsUploadOpen(true)}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#f7cfc0] bg-white px-4 py-3 text-sm font-semibold text-[#c55f4c] shadow-sm hover:bg-[#fff5ef]"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <UploadCloud className="h-4 w-4" />
                                Enviar foto
                            </motion.button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 pb-12">
                    {activePage === 'live' && (
                        <motion.div
                            key="live"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 lg:px-0"
                        >
                            <HeroSection
                                onUpload={() => setIsUploadOpen(true)}
                                highlightPhotos={highlightPhotos}
                            />
                        </motion.div>
                    )}

                    {activePage === 'gallery' && (
                        <div className="px-4 lg:px-0">
                            {/* Header com filtros e toggle */}
                            <div className="mb-6 flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-serif text-[#2f3430]">Todas as fotos</h2>
                                        <p className="mt-2 text-sm text-[#6a716a]">
                                            {filteredPhotos.length} {filteredPhotos.length === 1 ? 'foto' : 'fotos'}
                                            {filterPerson && ' filtrada(s)'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Toggle visualização mobile */}
                                        <div className="flex items-center gap-1 rounded-xl border border-white/70 bg-white/80 p-1 lg:hidden">
                                            <button
                                                onClick={() => setViewMode('masonry')}
                                                className={`rounded-lg p-2 transition ${viewMode === 'masonry' ? 'bg-[#ffede6] text-[#c96a59]' : 'text-[#8b918b]'}`}
                                                title="Layout Masonry"
                                            >
                                                <LayoutList className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`rounded-lg p-2 transition ${viewMode === 'grid' ? 'bg-[#ffede6] text-[#c96a59]' : 'text-[#8b918b]'}`}
                                                title="Grade Compacta"
                                            >
                                                <LayoutGrid className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Botão filtros */}
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${showFilters || filterPerson || sortBy !== 'recent'
                                                    ? 'border-[#f7cfc0] bg-[#ffede6] text-[#c96a59]'
                                                    : 'border-white/70 bg-white/80 text-[#6a716a] hover:bg-white'
                                                }`}
                                        >
                                            <Filter className="h-4 w-4" />
                                            <span className="hidden sm:inline">Filtros</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Painel de filtros */}
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-4"
                                    >
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {/* Filtro por pessoa */}
                                            <div>
                                                <label className="mb-2 block text-xs font-semibold text-[#6a716a]">
                                                    Filtrar por pessoa
                                                </label>
                                                <select
                                                    value={filterPerson}
                                                    onChange={(e) => setFilterPerson(e.target.value)}
                                                    className="w-full rounded-xl border border-[#f2d8ce] bg-white px-3 py-2 text-sm text-[#2f3430] outline-none focus:border-[#f48ca3] focus:ring-2 focus:ring-[#f48ca3]/15"
                                                >
                                                    <option value="">Todas as pessoas</option>
                                                    {uniquePeople.map(person => (
                                                        <option key={person.id} value={person.id}>
                                                            {person.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Ordenar por */}
                                            <div>
                                                <label className="mb-2 block text-xs font-semibold text-[#6a716a]">
                                                    Ordenar por
                                                </label>
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value as any)}
                                                    className="w-full rounded-xl border border-[#f2d8ce] bg-white px-3 py-2 text-sm text-[#2f3430] outline-none focus:border-[#f48ca3] focus:ring-2 focus:ring-[#f48ca3]/15"
                                                >
                                                    <option value="recent">Mais recentes</option>
                                                    <option value="oldest">Mais antigas</option>
                                                    <option value="likes">Mais curtidas</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Limpar filtros */}
                                        {(filterPerson || sortBy !== 'recent') && (
                                            <button
                                                onClick={() => {
                                                    setFilterPerson('');
                                                    setSortBy('recent');
                                                }}
                                                className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#c55f4c] hover:text-[#a84639]"
                                            >
                                                <X className="h-3 w-3" />
                                                Limpar filtros
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {filteredPhotos.length > 0 ? (
                                <PhotoGrid photos={filteredPhotos} viewMode={viewMode} />
                            ) : (
                                emptyState
                            )}
                        </div>
                    )}

                    {activePage === 'insights' && isPrivileged && (
                        <motion.div
                            key="insights"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 lg:px-0"
                        >
                            <GuestInsights users={guests} totalPhotos={photos.length} />
                        </motion.div>
                    )}
                </main>
            </div>

            <PhotoUpload isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </div>
    );
};
