import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

const ClickHearts = () => {
    const [hearts, setHearts] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            playSound('bubble');
            const id = Date.now();
            const newHeart = {
                id,
                x: e.clientX,
                y: e.clientY,
                size: Math.random() * 20 + 10,
                color: ['#ff9fcf', '#ff4d94', '#ffccf2', '#f06292'][Math.floor(Math.random() * 4)]
            };

            setHearts((prev) => [...prev, newHeart]);

            setTimeout(() => {
                setHearts((prev) => prev.filter(h => h.id !== id));
            }, 1000);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <AnimatePresence>
                {hearts.map((heart) => (
                    <motion.div
                        key={heart.id}
                        initial={{ opacity: 1, scale: 0, x: heart.x - heart.size / 2, y: heart.y - heart.size / 2 }}
                        animate={{
                            opacity: 0,
                            scale: 1.5,
                            y: heart.y - 150 - Math.random() * 50,
                            x: heart.x + (Math.random() * 100 - 50)
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute"
                        style={{ color: heart.color }}
                    >
                        <svg
                            width={heart.size}
                            height={heart.size}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ClickHearts;
