import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';

const Header = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        let timeoutId = null;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // If scrolling down, hide
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                // If scrolling up, show
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);

            // Show after 2 seconds of idleness
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [lastScrollY]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: isVisible ? 0 : -100 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center glass shadow-sm"
        >
            <div className="flex items-center gap-2">
                <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-2xl"
                >
                    ✨
                </motion.span>
                <span className="font-dreamy text-2xl text-pink-600 font-bold tracking-tight">
                    Princess's Day
                </span>
            </div>

            <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-pink-400 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse delay-75" />
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse delay-150" />
            </div>
        </motion.nav>
    );
};

export default Header;
