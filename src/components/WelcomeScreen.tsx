import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CalendarDays,
    LogIn,
    MapPin,
    ShieldCheck,
    Sparkles,
    Users,
    Loader2,
    BookmarkCheck,
} from 'lucide-react';
import { UserService, type SimilarUserError } from '../services/userService';
import { useUserStore } from '../store/userStore';
import { useToastStore } from './Toast';
import { deleteCookie, setCookie, GUEST_COOKIE_KEY } from '../utils/cookies';
import type { User } from '../types';

interface WelcomeScreenProps {
    onComplete: () => void;
}

const infoCards = [
    {
        label: 'Data',
        value: '07 de Fevereiro, 2026',
        icon: CalendarDays,
    },
    {
        label: 'Local',
        value: 'Nova Petrópolis / RS',
        icon: MapPin,
    },
];

export const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [rememberDevice, setRememberDevice] = useState(true);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'new' | 'returning' | 'error' | 'suggestion'>(
        'idle'
    );
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const setUser = useUserStore((state) => state.setUser);
    const addToast = useToastStore((state) => state.addToast);

    const completeSignIn = (user: User, isReturning: boolean) => {
        setUser(user);
        setStatus(isReturning ? 'returning' : 'new');
        setSuggestions([]);
        addToast(
            isReturning ? 'Bem-vindo(a) de volta ao álbum!' : 'Registro confirmado. Aproveite cada clique!',
            'success'
        );

        if (rememberDevice) {
            setCookie(GUEST_COOKIE_KEY, user.id);
        } else {
            deleteCookie(GUEST_COOKIE_KEY);
        }

        onComplete();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || loading) return;

        setLoading(true);
        setSuggestions([]);
        try {
            const { user, isReturning } = await UserService.signInWithName(name, nickname);
            completeSignIn(user, isReturning);
        } catch (error) {
            const similarError = error as SimilarUserError;
            if (similarError?.code === 'existing-user-suggestion') {
                setStatus('suggestion');
                setSuggestions(similarError.suggestions);
                addToast('Encontramos nomes parecidos. Escolha o seu na lista abaixo.', 'info');
            } else {
                console.error('Error creating user:', error);
                setStatus('error');
                addToast('Não foi possível validar seu nome. Confira e tente novamente.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionSelect = async (selectedUser: User) => {
        setLoading(true);
        try {
            const authenticatedUser = await UserService.authenticateExistingUser(
                selectedUser.id,
                nickname
            );
            completeSignIn(authenticatedUser, true);
        } catch (error) {
            console.error('Erro ao confirmar sugestão:', error);
            addToast('Não conseguimos confirmar este registro. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const statusMessage = {
        returning: 'Encontramos seu registro. Você já pode acessar o álbum completo.',
        new: 'Prontinho! Seu convite digital foi liberado com sucesso.',
        error: 'Ops! Não localizamos o nome informado. Confira e tente novamente.',
        suggestion: 'Encontramos nomes parecidos. Escolha o seu abaixo.',
        idle: '',
    }[status];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle,#fef5f7,#fff7ec,#fefdfb)] px-4 py-10 sm:py-14">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-[#ffd8c5] opacity-60 blur-3xl"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div
                    className="absolute -bottom-10 -left-6 h-80 w-80 rounded-full bg-[#f7c1d1] opacity-60 blur-3xl"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 7, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <motion.section
                    className="relative rounded-4xl border border-white/60 bg-white/80 p-8 shadow-[0_25px_120px_rgba(255,143,119,0.15)] backdrop-blur-xl sm:p-10"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#ffe6db] px-4 py-2 text-sm font-medium text-[#c25544]">
                        <Sparkles className="h-4 w-4" />
                        Álbum vivo de Marina & Pedro
                    </div>
                    <h1 className="mt-6 text-4xl font-serif leading-tight text-[#2e322f] sm:text-5xl">
                        Memórias compartilhadas entre família e amigos.
                    </h1>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {infoCards.map(({ icon: Icon, label, value }) => (
                            <motion.div
                                key={label}
                                className="flex items-start gap-4 rounded-2xl border border-[#f8d9d1] bg-white/70 p-5"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe1d5] text-[#d35e4a]">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.2em] text-[#c8775f]">
                                        {label}
                                    </p>
                                    <p className="text-lg font-semibold text-[#2e322f]">{value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-[#fddbd0] bg-[#fff6f0] p-5">
                            <div className="flex items-center gap-3 font-semibold text-[#d35e4a]">
                                <Users className="h-5 w-5" />
                                Convidados conectados
                            </div>
                            <p className="mt-3 text-sm text-[#5a625a]">
                                Basta dizer seu nome e o álbum já reconhece quem é você, liberando o
                                envio e a visualização das fotos do dia.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#dfe8dc] bg-[#f8fbf7] p-5">
                            <div className="flex items-center gap-3 font-semibold text-[#4c5e4c]">
                                <ShieldCheck className="h-5 w-5" />
                                Qualidade preservada
                            </div>
                            <p className="mt-3 text-sm text-[#5a625a]">
                                Cada clique mantém a luz e as cores tal como foram captadas durante o
                                casamento, perfeito para baixar e compartilhar.
                            </p>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    className="relative flex flex-col rounded-4xl border border-white/70 bg-white p-8 shadow-[0_25px_80px_rgba(84,36,23,0.15)] sm:p-10"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    <div className="flex flex-col items-center text-center">
                        <img
                            src="/Logo casamento_V1.png"
                            alt="Logo do casamento Marina & Pedro"
                            className="mb-4 h-32 w-32 object-contain"
                            loading="eager"
                        />
                        <h2 className="text-3xl font-serif text-[#2e322f]">Entre para o álbum</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-semibold text-[#5a625a]">
                                Nome completo
                            </label>
                            <input
                                id="fullName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex.: Gabriela Lessa"
                                className="w-full rounded-2xl border border-[#f2d8ce] bg-[#fff9f7] px-5 py-4 text-base text-[#2e322f] outline-none transition-shadow focus:border-[#f48ca3] focus:ring-4 focus:ring-[#f48ca3]/15"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="nickname" className="text-sm font-semibold text-[#5a625a]">
                                Como prefere aparecer no álbum? <span className="text-[#c25544]">(opcional)</span>
                            </label>
                            <input
                                id="nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Família , Grupo das Madrinhas..."
                                className="w-full rounded-2xl border border-[#f2d8ce] bg-[#fff9f7] px-5 py-4 text-base text-[#2e322f] outline-none transition-shadow focus:border-[#f48ca3] focus:ring-4 focus:ring-[#f48ca3]/15"
                                disabled={loading}
                            />
                        </div>

                        <label className="flex items-center gap-3 rounded-2xl bg-[#fff7f3] px-4 py-3 text-sm text-[#5a625a]">
                            <input
                                type="checkbox"
                                checked={rememberDevice}
                                onChange={(e) => setRememberDevice(e.target.checked)}
                                className="h-4 w-4 rounded border border-[#f1c8bd] text-[#c25544] focus:ring-[#f48ca3]"
                            />
                            Lembrar deste dispositivo para os próximos acessos.
                        </label>

                        {statusMessage && (
                            <p
                                className={`text-sm ${status === 'error' ? 'text-[#b42318]' : 'text-[#4c5e4c]'}`}
                            >
                                {statusMessage}
                            </p>
                        )}

                        {suggestions.length > 0 && (
                            <div className="rounded-2xl border border-[#f2d8ce] bg-[#fff5f1] p-4 text-sm text-[#5a625a]">
                                <p>Encontramos estes registros. Toque no seu nome para retomar:</p>
                                <div className="mt-3 flex flex-col gap-2">
                                    {suggestions.map((suggestion) => (
                                        <button
                                            key={suggestion.id}
                                            type="button"
                                            disabled={loading}
                                            onClick={() => handleSuggestionSelect(suggestion)}
                                            className="flex items-center justify-between rounded-2xl border border-[#f8d9d1] bg-white px-4 py-2 text-left font-semibold text-[#c25544] hover:bg-[#fff1eb] disabled:opacity-60"
                                        >
                                            <span>{suggestion.name}</span>
                                            {suggestion.nickname && (
                                                <span className="text-xs font-normal text-[#a17a70]">
                                                    {suggestion.nickname}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#f7cfc0] bg-white py-4 text-sm font-semibold text-[#c55f4c] shadow-sm hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-60"
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Validando convite
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-5 w-5" />
                                    Entrar no álbum
                                </>
                            )}
                        </motion.button>

                        <p className="flex items-center gap-2 text-xs text-[#9b9f9b]">
                            <BookmarkCheck className="h-4 w-4" />
                            Salvamos apenas seu nome e apelido para identificar as fotos.
                        </p>
                    </form>
                </motion.section>
            </div>
        </div>
    );
};
