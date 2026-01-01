import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/sounds';
import { getGoogleDriveImageLink } from '../utils/googleDrive';

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

                    {/* Beautiful Image Gallery Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: letterText.length * 0.03 + 1, duration: 0.8 }}
                        className="mt-16 pt-8 border-t border-white/20"
                    >
                        <h4 className="text-2xl font-dreamy text-gray-800 mb-8 flex items-center justify-center gap-3">
                            <span className="text-3xl animate-pulse">✨</span>
                            Kho báu kỷ niệm
                            <span className="text-3xl animate-pulse">✨</span>
                        </h4>

                        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                            {[
                                { url: "https://drive.google.com/file/d/1ZbZrblt6KDmcbracdkXFqMNXiOwo31C_/view?usp=drive_link", type: "image", caption: "Kỷ niệm 1" },
                                { url: "https://drive.google.com/file/d/1Ka5n6CfRQWoRE4Ru2gxmUbyaQ2RXhRzh/view?usp=drive_link", type: "video", caption: "Kỷ niệm 2" },
                                { url: "https://drive.google.com/file/d/1sYVbdRkNCfZvfBgQpC7gAyrsM89rB5x4/view?usp=drive_link", type: "image", caption: "Kho báu" },
                                { url: "https://drive.google.com/file/d/1tOCIojZKJmB1srhPWhFC-9qxR_AvWIfs/view?usp=drive_link", type: "video", caption: "Kho báu" },
                                { url: "https://drive.google.com/file/d/1wETx5Gqx__TeGfHZMdPp7CzuXnNwzTvw/view?usp=drive_link", type: "video", caption: "Demo" },
                                { url: "https://drive.google.com/file/d/1Mt1v2w9mV6fIe21AfhrmSCYuYE7STxd1/view?usp=drive_link", type: "image", caption: "Demo" },
                                { url: "https://drive.google.com/file/d/1nyzeX6NneGtDsK67iYML3bjn9kodoFLM/view?usp=drive_link", type: "image", caption: "Demo" },
                                { url: "https://drive.google.com/file/d/1UMo-7K6IlFsx8AirIpiWv5WDXGlKdVLL/view?usp=drive_link", type: "image", caption: "Demo" },
                                { url: "https://drive.google.com/file/d/16Biiye7b7qLt6T4D3vPQADV9HRbguiW-/view?usp=drive_link", type: "image", caption: "Demo" },
                                { url: "https://drive.google.com/file/d/1j9anfoYzRkhfpDkCD9QwMTcX-508YzD5/view?usp=drive_link", type: "image", caption: "Demo" },
                                { url: "https://drive.google.com/file/d/1zy3nx5psCkxSxwF-vXFHVBh1fOKQgVZg/view?usp=drive_link", type: "image", caption: "Demo" },
                                // Add more items with type: "video" if needed, using direct link logic or iframe
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    className="relative break-inside-avoid rounded-2xl overflow-hidden border-4 border-white shadow-lg group bg-gray-100/50 mb-4"
                                >
                                    {item.type === 'video' ? (
                                        <div className="relative w-full aspect-video bg-black">
                                            <iframe
                                                src={item.url.replace('/view', '/preview')}
                                                className="absolute inset-0 w-full h-full border-0 block"
                                                allow="autoplay; encrypted-media; fullscreen"
                                                allowFullScreen
                                                title={`Video ${i}`}
                                            />
                                        </div>
                                    ) : (
                                        <img
                                            src={getGoogleDriveImageLink(item.url)}
                                            alt={item.caption || `Kỷ niệm ${i + 1}`}
                                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 block"
                                            loading="lazy"
                                        />
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-end p-4">
                                        <span className="text-white text-sm font-medium">{item.caption}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-8 italic">
                            (Dán link ảnh Google Drive của bạn vào để tạo kho báu riêng nhé! 💝)
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Surprise;
