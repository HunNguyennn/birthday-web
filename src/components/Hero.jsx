import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Heart } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-20 px-4">
            {/* Background Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={`cloud-${i}`}
                        className="absolute text-white/40"
                        initial={{ x: -100, y: Math.random() * 100 + '%' }}
                        animate={{
                            x: '110vw',
                            y: [null, (Math.random() * 10 - 5) + 'vh', (Math.random() * 10 - 5) + 'vh']
                        }}
                        transition={{
                            duration: 20 + Math.random() * 20,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 5
                        }}
                    >
                        <Cloud size={48 + Math.random() * 40} fill="currentColor" />
                    </motion.div>
                ))}

                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={`heart-${i}`}
                        className="absolute text-pink-300/50"
                        initial={{ y: '110vh', x: Math.random() * 100 + 'vw' }}
                        animate={{
                            y: '-20vh',
                            x: [null, (Math.random() * 50 - 25) + 'px', (Math.random() * 50 - 25) + 'px']
                        }}
                        transition={{
                            duration: 10 + Math.random() * 15,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: i * 2
                        }}
                    >
                        <Heart size={16 + Math.random() * 24} fill="currentColor" />
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-center z-10 w-full px-2"
            >
                <h1 className="font-dreamy mb-8 leading-none drop-shadow-[0_5px_15px_rgba(255,105,180,0.3)]">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x pb-4 whitespace-nowrap text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
                        Chào cục cưng xinh iuu
                    </span>
                    <span className="block text-gray-800 text-xl md:text-3xl lg:text-4xl mt-4 font-bold tracking-tight">
                        Chúc mừng sinh nhật nhóoo ❤️🎂✨
                    </span>
                </h1>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-1 w-32 bg-pink-300 mx-auto mb-8 rounded-full"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-600 font-medium italic"
                >
                    Chúc em tuổi mới thêm xinh, thêm giỏi, và yêu anh nhiều hơn nữa nhé! 🎂✨
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Hero;
