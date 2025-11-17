import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Search, UsersRound } from 'lucide-react';
import type { User } from '../types';
import { RoleBadge } from './RoleBadge';

interface GuestInsightsProps {
    users: User[];
    totalPhotos: number;
}

export const GuestInsights = ({ users, totalPhotos }: GuestInsightsProps) => {
    const [search, setSearch] = useState('');

    const filteredUsers = useMemo(() => {
        if (!search) return users;
        return users.filter((user) =>
            user.name.toLowerCase().includes(search.trim().toLowerCase())
        );
    }, [search, users]);

    const topContributors = useMemo(
        () => [...users].sort((a, b) => b.photoCount - a.photoCount).slice(0, 3),
        [users]
    );

    return (
        <section className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
                <motion.div
                    className="rounded-3xl border border-white/70 bg-white/70 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(84,36,23,0.08)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-xs uppercase tracking-[0.4em] text-[#d4816c]">
                        Convidados
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                        <UsersRound className="h-5 w-5 text-[#d4816c]" />
                        <span className="text-3xl font-serif text-[#2f3430]">
                            {users.length.toString().padStart(2, '0')}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-[#858a85]">
                        Pessoas que já registraram presença no álbum colaborativo.
                    </p>
                </motion.div>

                <motion.div
                    className="rounded-3xl border border-white/70 bg-white/70 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(84,36,23,0.08)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <p className="text-xs uppercase tracking-[0.4em] text-[#d4816c]">
                        Fotos recebidas
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                        <Camera className="h-5 w-5 text-[#d4816c]" />
                        <span className="text-3xl font-serif text-[#2f3430]">
                            {totalPhotos.toString().padStart(2, '0')}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-[#858a85]">
                        Contagem em tempo real diretamente do Firebase Storage.
                    </p>
                </motion.div>

                <motion.div
                    className="rounded-3xl border border-[#ffe5dc] bg-[#fff8f5] p-6 shadow-[0_20px_60px_rgba(84,36,23,0.08)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <p className="text-xs uppercase tracking-[0.4em] text-[#c35d4d]">
                        Top contribuidores
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-[#5a625a]">
                        {topContributors.map((guest) => {
                            const displayName = guest.nickname || guest.name;
                            return (
                                <div key={guest.id} className="flex items-center justify-between">
                                    <span className="font-semibold">{displayName}</span>
                                    <span className="text-[#c35d4d]">{guest.photoCount} fotos</span>
                                </div>
                            );
                        })}
                        {topContributors.length === 0 && (
                            <p className="text-[#9da59d]">Aguardando os primeiros envios ✨</p>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-[0_25px_80px_rgba(84,36,23,0.08)] backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-serif text-[#2f3430]">Lista de convidados</h3>
                    <div className="flex items-center gap-2 rounded-2xl border border-[#f4dedd] bg-white px-4 py-2">
                        <Search className="h-4 w-4 text-[#c57a64]" />
                        <input
                            type="text"
                            placeholder="Buscar por nome"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-44 bg-transparent text-sm text-[#2f3430] outline-none placeholder:text-[#b3b7b3]"
                        />
                    </div>
                </div>

                <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-2">
                    {filteredUsers.map((guest) => {
                        const displayName = guest.nickname || guest.name;
                        return (
                            <div
                                key={guest.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f4dedd] bg-[#fffaf7] px-4 py-3"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-[#2f3430]">{displayName}</p>
                                    <p className="text-xs text-[#858a85]">
                                        Último acesso:{' '}
                                        {guest.lastActive
                                            ? guest.lastActive.toLocaleDateString('pt-BR', {
                                                  day: '2-digit',
                                                  month: 'short',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })
                                            : '—'}
                                    </p>
                                </div>
                                <RoleBadge role={guest.role} size="sm" />
                                <div className="text-sm font-semibold text-[#c35d4d]">
                                    {guest.photoCount} fotos
                                </div>
                            </div>
                        );
                    })}

                    {filteredUsers.length === 0 && (
                        <p className="py-6 text-center text-sm text-[#9da59d]">
                            Nenhum convidado encontrado com esse nome.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};
