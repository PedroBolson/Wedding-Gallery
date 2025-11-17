import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const HEART_COUNT = 12;
const SPARKLE_COUNT = 18;

const generateItems = (count: number, width: number) =>
    Array.from({ length: count }, (_, index) => ({
        id: index,
        x: Math.random() * width,
        delay: Math.random() * 8,
        duration: 16 + Math.random() * 8,
        size: 0.8 + Math.random() * 1.2,
    }));

export const FloatingElements = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    const hearts = useMemo(
        () => generateItems(HEART_COUNT, dimensions.width || 1920),
        [dimensions.width]
    );
    const sparkles = useMemo(
        () => generateItems(SPARKLE_COUNT, dimensions.width || 1920),
        [dimensions.width]
    );

    if (!dimensions.width) return null;

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            {hearts.map((item) => (
                <motion.div
                    key={`heart-${item.id}`}
                    className="absolute text-[#f5a8a2]/30"
                    style={{ left: item.x }}
                    initial={{ y: dimensions.height + 50, opacity: 0 }}
                    animate={{ y: -80, opacity: [0, 0.4, 0] }}
                    transition={{
                        duration: item.duration,
                        delay: item.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <Heart
                        className="drop-shadow-[0_8px_20px_rgba(246,161,146,0.25)]"
                        style={{ width: `${24 * item.size}px`, height: `${24 * item.size}px` }}
                        fill="currentColor"
                    />
                </motion.div>
            ))}

            {sparkles.map((item) => (
                <motion.div
                    key={`sparkle-${item.id}`}
                    className="absolute text-[#fcd5c8]/60"
                    style={{ left: item.x }}
                    initial={{ y: Math.random() * dimensions.height, scale: 0 }}
                    animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0] }}
                    transition={{
                        duration: 4 + Math.random() * 2,
                        delay: item.delay / 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <Sparkles style={{ width: `${16 * item.size}px`, height: `${16 * item.size}px` }} />
                </motion.div>
            ))}
        </div>
    );
};
