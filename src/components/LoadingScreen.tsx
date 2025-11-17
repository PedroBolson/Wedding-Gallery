import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingScreen = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle,_#fff8f5,_#fff3ee,_#fdfdf9)] px-4">
            <motion.div
                className="relative flex w-full max-w-md flex-col items-center rounded-[32px] border border-white/70 bg-white/70 p-10 text-center shadow-[0_20px_80px_rgba(255,143,119,0.15)] backdrop-blur-xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="absolute -top-6 right-6 rounded-full bg-[#ffe6df]/80 p-3 text-[#d66e5c]">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff1ed]">
                    <Loader2 className="h-8 w-8 text-[#f08186] animate-spin" />
                </div>
                <h2 className="text-2xl font-serif text-[#2f3430]">Preparando o álbum</h2>
                <p className="mt-2 text-sm text-[#6a716a]">
                    Conectando com o Firebase, buscando convidados e fotos em tempo real.
                </p>
            </motion.div>
        </div>
    );
};
