import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, UploadCloud, X } from 'lucide-react';
import { PhotoService } from '../services/photoService';
import { useUserStore } from '../store/userStore';
import { useToastStore } from './Toast';
import type { UploadProgress, UserRole } from '../types';

interface PhotoUploadProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PhotoUpload = ({ isOpen, onClose }: PhotoUploadProps) => {
    const [uploads, setUploads] = useState<UploadProgress[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const user = useUserStore((state) => state.user);
    const addToast = useToastStore((state) => state.addToast);

    const isSupportedImage = (file: File) => {
        const mime = file.type?.toLowerCase();
        if (mime && mime.startsWith('image/')) return true;
        if (!mime) return true;
        const extension = file.name.split('.').pop()?.toLowerCase();
        return extension ? ['heic', 'heif', 'dng', 'raw', 'raf', 'jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(extension) : false;
    };

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || !user) return;
        const userRole = (user.role || 'convidado') as UserRole;

        const fileArray = Array.from(files).filter(isSupportedImage);

        if (fileArray.length === 0) {
            addToast('Não conseguimos ler esse formato. Tente exportar a foto ou selecionar outra.', 'error');
            return;
        }
        let hasError = false;

        for (const file of fileArray) {
            const uploadId = crypto.randomUUID();
            const newUpload: UploadProgress = {
                id: uploadId,
                fileName: file.name,
                progress: 0,
                status: 'uploading',
            };

            setUploads((prev) => [...prev, newUpload]);

            try {
                await PhotoService.uploadPhoto(
                    file,
                    user.id,
                    user.nickname || user.name,
                    userRole,
                    (progress) => {
                        setUploads((prev) =>
                            prev.map((u) => (u.id === uploadId ? { ...u, progress } : u))
                        );
                    }
                );

                setUploads((prev) =>
                    prev.map((u) =>
                        u.id === uploadId ? { ...u, status: 'completed' as const } : u
                    )
                );

                setTimeout(() => {
                    setUploads((prev) => prev.filter((u) => u.id !== uploadId));
                }, 2200);
            } catch (error) {
                hasError = true;
                setUploads((prev) =>
                    prev.map((u) =>
                        u.id === uploadId
                            ? { ...u, status: 'error' as const, error: 'Erro ao enviar' }
                            : u
                    )
                );
                addToast('Não conseguimos enviar algumas fotos. Tente novamente.', 'error');
            }
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        if (fileArray.length > 0 && !hasError) {
            setTimeout(() => {
                onClose();
            }, 500);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        handleFileSelect(event.dataTransfer.files);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_30px_120px_rgba(84,36,23,0.25)] backdrop-blur-xl"
                        initial={{ scale: 0.92, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-serif text-[#2f3430]">
                                    Compartilhe suas fotos
                                </h2>
                                <p className="mt-1 text-sm text-[#7c827c]">
                                    Arquivos até 50MB, sem perda de qualidade. Usamos
                                    metadados para identificar cada convidado.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full bg-[#fff2ee] p-2 text-[#c96a59] transition hover:bg-[#fcded5]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div
                            className={`mt-8 rounded-[28px] border-2 border-dashed p-10 text-center transition ${isDragging
                                ? 'border-[#f37d84] bg-[#fff2f0]'
                                : 'border-[#f4dedd] bg-white/70 hover:border-[#f37d84]'
                                }`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            <UploadCloud className="mx-auto h-16 w-16 text-[#f37d84]" strokeWidth={1.3} />
                            <p className="mt-4 text-lg font-semibold text-[#2f3430]">
                                Arraste e solte arquivos aqui
                            </p>
                            <p className="text-sm text-[#7c827c]">ou clique abaixo para selecionar</p>
                            <button
                                onClick={() => {
                                    const input = fileInputRef.current;
                                    if (!input) return;
                                    input.removeAttribute('capture');
                                    input.click();
                                }}
                                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#f7cfc0] bg-white px-8 py-3 text-sm font-semibold text-[#c55f4c] shadow-sm hover:bg-[#fff5ef]"
                            >
                                Escolher imagens
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files)}
                            />
                            <p className="mt-3 text-xs text-[#9da19d]">
                                Formatos suportados: JPG, PNG, HEIC e WEBP
                            </p>
                        </div>

                        {uploads.length > 0 && (
                            <div className="mt-8 space-y-3">
                                {uploads.map((upload) => (
                                    <motion.div
                                        key={upload.id}
                                        className="rounded-2xl border border-[#f4dedd] bg-[#fff9f7] p-4"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="truncate text-sm font-semibold text-[#2f3430]">
                                                {upload.fileName}
                                            </p>
                                            {upload.status === 'completed' && (
                                                <CheckCircle2 className="h-5 w-5 text-[#4caf50]" />
                                            )}
                                            {upload.status === 'error' && (
                                                <AlertCircle className="h-5 w-5 text-[#d33b39]" />
                                            )}
                                        </div>
                                        {upload.status === 'uploading' && (
                                            <div className="mt-3 h-2 rounded-full bg-[#f4dedd]">
                                                <motion.div
                                                    className="h-full rounded-full bg-linear-to-r from-[#ff9c80] to-[#f97794]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${upload.progress}%` }}
                                                />
                                            </div>
                                        )}
                                        {upload.status === 'error' && (
                                            <p className="mt-2 text-xs text-[#d33b39]">{upload.error}</p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
