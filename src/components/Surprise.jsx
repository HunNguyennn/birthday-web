import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/sounds';

import { FloatingHearts } from './BackgroundEffects';

const Surprise = ({ initialExploded = false }) => {
    const [exploded, setExploded] = useState(initialExploded);

    const handleExplode = () => {
        playSound('explosion');
        setTimeout(() => playSound('magic'), 500);
        setExploded(true);

        // Confetti burst with Hearts
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 40, spread: 360, ticks: 100, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 60 * (timeLeft / duration);

            // Standard confetti
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });

            // Hearts
            confetti({
                ...defaults,
                particleCount: 15,
                shapes: ['heart'],
                colors: ['#ff69b4', '#ff1493', '#ffc0cb'],
                origin: { x: Math.random(), y: Math.random() - 0.2 }
            });
        }, 250);
    };

    const letterText = "Gửi Công chúa của anh,\n\nChúc mừng sinh nhật em! Cảm ơn em đã xuất hiện và làm cho cuộc sống của anh thêm nhiều sắc màu (mặc dù đôi khi cũng hơi đau đầu vì em dỗi 😅). Chúc em sang tuổi mới luôn rạng rỡ, hạnh phúc, và lúc nào cũng là cô gái tuyệt vời nhất trong mắt anh. Anh hứa sẽ luôn ở bên cạnh, chiều chuộng và mua thật nhiều trà sữa cho em!\n\nYêu em nhiều ❤️";

    return (
        <div className="py-32 flex flex-col items-center justify-center min-h-[60vh]">
            {!exploded ? (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleExplode}
                    className="px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all uppercase tracking-widest"
                >
                    Bấm vào đây để nổ tung! 💥
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="glass p-10 rounded-[40px] shadow-2xl max-w-2xl mx-4 relative overflow-hidden bg-white/40"
                >
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <FloatingHearts />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-blue-400" />

                    <h3 id="letter-title" className="text-3xl font-dreamy text-gray-800 mb-6 text-center">Bức thư bí mật...</h3>

                    <div className="font-sans text-gray-700 leading-relaxed whitespace-pre-wrap text-lg italic">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2 }}
                        >
                            {letterText.split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: letterText.length * 0.03 + 0.5 }}
                        className="mt-10 text-right font-dreamy text-2xl text-pink-600"
                    >
                        Mãi yêu em, <br />
                        Mối tình của em ❤️
                    </motion.div>

                    {/* Video Placeholders Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: letterText.length * 0.03 + 1, duration: 0.8 }}
                        className="mt-16 pt-8 border-t border-white/20"
                    >
                        <h4 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                            <span className="text-2xl">📽️</span> Những thước phim kỷ niệm
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-video bg-gray-200/50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 group hover:border-pink-300 transition-colors cursor-pointer overflow-hidden relative">
                                    <div className="text-gray-400 group-hover:text-pink-400 transition-colors flex flex-col items-center">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        <span className="text-xs mt-2 font-bold uppercase tracking-widest">Video Kỷ Niệm {i}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-pink-100 opacity-0 group-hover:opacity-20 transition-opacity" />
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-4 italic">
                            (Bỏ video của em vào folder public/videos/ để thay thế nhé!)
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Surprise;
