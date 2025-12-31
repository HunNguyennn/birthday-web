import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { playSound } from '../utils/sounds';
import albumCover from '../context/Cover of SINH NHAT by HIEUTHUHAI.jpg';

const VinylRecord = () => {
    const { isPlaying, togglePlay, frequencyData, currentTime, duration } = useMusic();

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleToggle = () => {
        playSound('magic');
        togglePlay();
    };

    // Use frequency data to scale bars
    const barsCount = 20;
    const waveData = frequencyData.length > 0
        ? frequencyData.slice(0, barsCount).map(v => (v / 255) * 60 + 5)
        : Array(barsCount).fill(5);

    return (
        <section className="py-20 relative flex flex-col items-center justify-center overflow-hidden">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">

                {/* Vinyl Record */}
                <div className="relative group">
                    <motion.div
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-64 h-64 md:w-80 md:h-80 bg-[#121212] rounded-full shadow-[0_0_60px_rgba(0,0,0,0.5)] relative flex items-center justify-center border-[12px] border-[#1a1a1a]"
                        style={{
                            background: 'radial-gradient(circle, #2a2a2a 0%, #121212 100%)',
                        }}
                    >
                        {/* Realistic Grooves Texture */}
                        <div className="absolute inset-0 rounded-full opacity-40 pointer-events-none"
                            style={{
                                background: 'repeating-radial-gradient(circle, #222, #222 1px, transparent 1px, transparent 3px)',
                            }}
                        />

                        {/* Light Reflections */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-transparent via-white/5 to-transparent pointer-events-none" />

                        {/* Center Label - Local Image */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#333] z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                            <img
                                src={albumCover}
                                alt="Album Cover"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Center Hole */}
                        <div className="absolute w-4 h-4 bg-[#fdfcfb] rounded-full z-20 shadow-md border border-gray-300" />

                        {/* Play/Pause Overlay */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleToggle}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-30 rounded-full"
                        >
                            <div className="w-16 h-16 rounded-full bg-pink-500/80 backdrop-blur-sm flex items-center justify-center text-white shadow-xl">
                                {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
                            </div>
                        </motion.button>
                    </motion.div>

                    {/* Tonearm */}
                    <motion.div
                        initial={{ rotate: -45 }}
                        animate={{ rotate: isPlaying ? 0 : -45 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="absolute top-0 right-[-30px] w-40 h-4 origin-right z-40 hidden md:block"
                    >
                        <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-600 rounded-full shadow-lg relative">
                            <div className="absolute left-0 top-[-8px] w-8 h-14 bg-gray-800 rounded-sm transform -rotate-15 border-l-4 border-gray-500 shadow-md" />
                            <div className="absolute right-0 top-[-5px] w-10 h-14 bg-gray-700/80 rounded-full border-2 border-gray-500" />
                        </div>
                    </motion.div>
                </div>

                {/* Track Info */}
                <div className="flex flex-col items-center md:items-start w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full"
                    >
                        <h2 className="text-4xl md:text-5xl font-dreamy text-pink-600 mb-2 text-center md:text-left drop-shadow-sm">
                            SINH NHẬT 🥳
                        </h2>
                        <h3 className="text-xl text-gray-600 font-medium mb-6 italic text-center md:text-left">
                            HIEUTHUHAI (ft. You)
                        </h3>

                        {/* REAL Audio Wave */}
                        <div className="flex items-end gap-[4px] h-20 mb-8 justify-center md:justify-start">
                            {waveData.map((h, i) => (
                                <motion.div
                                    key={i}
                                    style={{ height: h }}
                                    className="w-2.5 bg-gradient-to-t from-pink-400 to-purple-500 rounded-full opacity-80"
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-6 justify-center md:justify-start">
                            <div className="text-sm font-mono text-gray-400 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-pink-100/50 min-w-[120px] text-center">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                            <div className="flex gap-1.5">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: isPlaying ? [0.3, 1, 0.3] : 0.3 }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-1.5 h-1.5 rounded-full bg-pink-400"
                                    />
                                ))}
                            </div>
                            <div className="text-xs uppercase tracking-[0.2em] text-pink-500 font-black flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                FLAC 24-bit
                            </div>
                        </div>

                        <p className="mt-8 text-gray-500 italic text-sm text-center md:text-left leading-relaxed">
                            "Bật nhạc lên và cùng lắng nghe món quà tinh thần này nhé!"
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default VinylRecord;
