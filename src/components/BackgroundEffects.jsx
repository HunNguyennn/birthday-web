import React from 'react';
import { motion } from 'framer-motion';
import { Music, Gift, Star, Aperture, Heart } from 'lucide-react';

// Shared config for cohesive feel
const TRANSITION_CONFIG = {
    duration: 20,
    repeat: Infinity,
    ease: "linear"
};

export const FloatingMusic = React.memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute text-purple-300/30 will-change-transform"
                initial={{ y: '100%', x: Math.random() * 100 + '%', opacity: 0 }}
                animate={{
                    y: '-10%',
                    opacity: [0, 0.5, 0],
                    rotate: [0, 20, -20, 0]
                }}
                transition={{
                    ...TRANSITION_CONFIG,
                    duration: 15 + Math.random() * 10,
                    delay: i * 2,
                }}
            >
                <Music size={20 + Math.random() * 30} />
            </motion.div>
        ))}
    </div>
));

export const BokehLights = React.memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute bg-yellow-200/20 rounded-full blur-xl will-change-transform"
                style={{
                    width: Math.random() * 100 + 50 + 'px',
                    height: Math.random() * 100 + 50 + 'px',
                }}
                initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
                animate={{
                    x: [null, Math.random() * 100 + '%'],
                    y: [null, Math.random() * 100 + '%'],
                    scale: [1, 1.2, 0.8, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                    duration: 20 + Math.random() * 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />
        ))}
    </div>
));

export const FloatingGifts = React.memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute text-pink-400/20 will-change-transform"
                initial={{ y: '-10%', x: Math.random() * 100 + '%', opacity: 0 }}
                animate={{
                    y: '110%',
                    opacity: [0, 0.6, 0],
                    rotate: [0, 90, 180, 270]
                }}
                transition={{
                    ...TRANSITION_CONFIG,
                    duration: 12 + Math.random() * 10,
                    delay: i * 3,
                }}
            >
                <Gift size={24 + Math.random() * 24} />
            </motion.div>
        ))}
    </div>
));

export const TwinklingStars = React.memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute text-yellow-300/40 will-change-transform"
                initial={{
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    scale: 0
                }}
                animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                    rotate: [0, 45, 90]
                }}
                transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut"
                }}
            >
                <Star size={12 + Math.random() * 12} fill="currentColor" />
            </motion.div>
        ))}
    </div>
));

export const FloatingHearts = React.memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ y: '-10vh', opacity: 0 }}
                animate={{ y: '110vh', opacity: 1 }}
                transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "linear"
                }}
                className="absolute text-pink-400 will-change-transform"
                style={{
                    // Evenly distribute hearts across the width to avoid gaps
                    left: `${(i / 15) * 100 + Math.random() * 5}%`
                }}
            >
                <Heart size={Math.random() * 20 + 10} fill="currentColor" />
            </motion.div>
        ))}
    </div>
));
