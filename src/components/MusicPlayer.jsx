import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, Heart, Shuffle, ChevronDown, SkipBack, SkipForward, Repeat } from 'lucide-react';
import { playSound } from '../utils/sounds';
import { useMusic } from '../context/MusicContext';
import albumCover from '../context/Cover of SINH NHAT by HIEUTHUHAI.jpg';

const MusicPlayer = () => {
    const { isPlaying, togglePlay, frequencyData } = useMusic();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const handleTogglePlay = (e) => {
        e.stopPropagation();
        togglePlay();
    };

    const toggleExpand = () => {
        playSound('click');
        setIsExpanded(!isExpanded);
    };

    // Use slice of frequency data for the bar visualizers
    const topWaveData = frequencyData.length > 0 ? frequencyData.slice(5, 35).map(v => (v / 255) * 40 + 4) : Array(30).fill(4);
    const miniWaveData = frequencyData.length > 0 ? frequencyData.slice(0, 3).map(v => (v / 255) * 10 + 2) : Array(3).fill(2);

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
                        className="mb-4 w-[350px] bg-white/10 backdrop-blur-3xl rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col p-6 text-white"
                        style={{ background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.4), rgba(219, 39, 119, 0.4))' }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <motion.button whileTap={{ scale: 0.8 }} onClick={toggleExpand}>
                                <ChevronDown size={24} className="text-white/70" />
                            </motion.button>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Now Playing</span>
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-[10px]">•••</span>
                            </div>
                        </div>

                        {/* Track Info & Image */}
                        <div className="flex flex-col items-center mb-8">
                            <motion.div
                                animate={{ rotate: isPlaying ? 360 : 0 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="w-48 h-48 rounded-full border-[8px] border-white/10 shadow-2xl overflow-hidden mb-6 relative"
                            >
                                <img
                                    src={albumCover}
                                    alt="Album Art"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent" />
                            </motion.div>

                            <h3 className="text-2xl font-bold mb-1">SINH NHẬT</h3>
                            <p className="text-white/60 text-sm">HIEUTHUHAI</p>
                        </div>

                        {/* REAL Waveform */}
                        <div className="flex items-center justify-center gap-[3px] h-12 mb-8 px-4">
                            {topWaveData.map((h, i) => (
                                <motion.div
                                    key={i}
                                    style={{ height: h }}
                                    className="w-1 bg-white/40 rounded-full"
                                />
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between px-4 mb-4">
                            <Shuffle size={18} className="text-white/30" />
                            <div className="flex items-center gap-8">
                                <SkipBack size={28} />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleTogglePlay}
                                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg"
                                >
                                    {isPlaying ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" className="ml-1" />}
                                </motion.button>
                                <SkipForward size={28} />
                            </div>
                            <Repeat size={18} className="text-white/30" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isExpanded && (
                <motion.div
                    className="glass bg-white/20 backdrop-blur-xl p-2 pr-6 rounded-full flex items-center gap-4 shadow-2xl border border-white/30 cursor-pointer"
                    onClick={toggleExpand}
                >
                    <motion.div
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white/50"
                    >
                        <img src={albumCover} className="w-full h-full object-cover" />
                    </motion.div>

                    <div className="flex flex-col overflow-hidden max-w-[120px]">
                        <h4 className="text-xs font-bold text-gray-800 truncate">SINH NHẬT</h4>
                        <div className="flex items-center gap-1.5 overflow-hidden">
                            {isPlaying && (
                                <div className="flex gap-[1px] items-end h-3">
                                    {miniWaveData.map((h, i) => (
                                        <div key={i} style={{ height: h }} className="w-[1.5px] bg-pink-500" />
                                    ))}
                                </div>
                            )}
                            <span className="text-[10px] text-pink-500 font-medium truncate">{isPlaying ? 'Listening...' : 'Paused'}</span>
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={handleTogglePlay}
                        className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md ml-auto"
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
};

export default MusicPlayer;
