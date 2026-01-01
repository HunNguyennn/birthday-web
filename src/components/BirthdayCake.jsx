import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sounds';
import confetti from 'canvas-confetti';
import { useMusic } from '../context/MusicContext';

// Celebration audio URL - Replace with your own link!
const CELEBRATION_AUDIO_URL = "https://audio.jukehost.co.uk/6nW3H2whHbxA8bw3SYJD5ZADw0Y1mGeP"; // Example: Congratulations sound
const NEW_BGM_URL = "https://audio.jukehost.co.uk/bleasUa48UL3UwHMkM69XH8zZ98sGjw3";

const BirthdayCake = ({ onComplete }) => {
    const { addTrack, playTrack, pauseWithFade } = useMusic();
    const celebrationPlayed = useRef(false);
    const [age, setAge] = useState('');
    const [isAgeSet, setIsAgeSet] = useState(false);
    const [candles, setCandles] = useState([]);
    const [error, setError] = useState('');

    // Fan states
    const [isFanOn, setIsFanOn] = useState(false);
    const [allBlownOut, setAllBlownOut] = useState(false);
    const [showFan, setShowFan] = useState(false); // New state to keep fan visible

    // Play celebration audio when all candles are blown out
    useEffect(() => {
        if (allBlownOut && !celebrationPlayed.current) {
            celebrationPlayed.current = true;

            // Fade out current background music
            pauseWithFade();

            const audio = new Audio(CELEBRATION_AUDIO_URL);
            audio.volume = 1; // loud
            audio.play().catch(e => console.log("Audio play failed", e));

            // When celebration sound ends, Add & Play new song
            audio.onended = () => {
                const newTrack = {
                    title: "Giấc Mơ",
                    artist: "Hưng Nguyễn cover",
                    url: NEW_BGM_URL,
                    // Optionally add a specific cover image for this track if you have one
                    // image: someCoverUrl
                };
                addTrack(newTrack);

                // We assume the new track is at index 1 since we just appended it to the initial one
                // A safer way would be to find the index but this is fine for this specific flow.
                // Or "playTrack(playlist.length)" but addTrack is not sync wrapper here immediately returning new list.
                // However, state update in context is fast enough or we just wait a tick?
                // Actually addTrack in context uses callback.
                // Let's use a timeout to ensure state update happened or just assume it works.
                setTimeout(() => {
                    playTrack(1);
                }, 100);
            };
        }
    }, [allBlownOut, addTrack, playTrack, pauseWithFade]);

    // Derive litCount
    const litCount = useMemo(() => candles.filter(c => c.isLit).length, [candles]);

    // Show fan when all candles are lit
    useEffect(() => {
        if (litCount === 20) {
            setShowFan(true);
        }
    }, [litCount]);

    const handleSetAge = (e) => {
        e.preventDefault();
        const num = parseInt(age);

        if (num === 20) {
            playSound('pop');
            setError('');

            const premiumColors = [
                'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
                'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
                'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)',
                'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)'
            ];

            // Tiers configuration
            // All tiers now use Front Arc to absolutely prevent front-back visual overlaps
            const tiers = [
                // Top: Front arc 0 to PI (Semi-circle), slightly wider X spread
                { count: 5, rx: 80, ry: 25, y: 70, minA: 0, maxA: Math.PI },

                // Mid: Front arc
                { count: 7, rx: 160, ry: 40, y: 160, minA: 0.2, maxA: Math.PI - 0.2 },

                // Bot: Front arc
                { count: 8, rx: 240, ry: 50, y: 250, minA: 0.1, maxA: Math.PI - 0.1 }
            ];

            const newCandles = [];
            let candleId = 0;

            tiers.forEach((tier) => {
                const angleStep = (tier.maxA - tier.minA) / (tier.count > 1 ? tier.count - 1 : 1);

                for (let i = 0; i < tier.count; i++) {
                    // Standard arc calculation for ALL tiers
                    const finalAngle = tier.minA + (i * angleStep);

                    newCandles.push({
                        id: candleId,
                        isLit: false,
                        wasLit: false,
                        x: Math.cos(finalAngle) * tier.rx,
                        y: Math.sin(finalAngle) * tier.ry + tier.y,
                        z: 50,
                        color: premiumColors[candleId % premiumColors.length],
                        rotate: (Math.random() - 0.5) * 4, // Reduced rotation randomness
                        height: 38 + Math.random() * 5,
                        delay: candleId * 0.05,
                    });
                    candleId++;
                }
            });

            setCandles(newCandles);
            setIsAgeSet(true);
        } else {
            playSound('error');
            setAge('');
            setError("Ầy, chỉ dành cho người đẹp 20 tuổi thôi nhé! 😉");
        }
    };

    const lightCandle = (id) => {
        if (isFanOn || allBlownOut) return;
        setCandles(prev => {
            const candle = prev.find(c => c.id === id);
            if (candle && !candle.isLit) {
                playSound('magic');
                return prev.map(c => c.id === id ? { ...c, isLit: true } : c);
            }
            return prev;
        });
    };

    // Sequential blowing out logic
    useEffect(() => {
        if (isFanOn && litCount > 0) {
            const timer = setTimeout(() => {
                setCandles(prev => {
                    const nextCandles = [...prev];
                    const litCandles = nextCandles.filter(c => c.isLit).sort((a, b) => b.x - a.x);
                    if (litCandles.length > 0) {
                        const target = nextCandles.find(c => c.id === litCandles[0].id);
                        if (target) {
                            target.isLit = false;
                            target.wasLit = true;
                            playSound('pop');
                        }
                    }
                    return nextCandles;
                });
            }, 100);
            return () => clearTimeout(timer);
        } else if (isFanOn && litCount === 0) {
            const timer = setTimeout(() => {
                setIsFanOn(false);
                setTimeout(() => {
                    setAllBlownOut(true);
                    playSound('success');
                    setTimeout(() => playSound('redeem'), 300); // Play another happy sound shortly after

                    // Automatic celebration confetti
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#FF69B4', '#FFB6C1', '#FFC0CB']
                    });
                }, 1000); // Fan disappears 1s after turning off
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isFanOn, litCount]);

    const handleFinalExplosion = () => {
        playSound('explosion');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ff69b4', '#ffffff', '#ffd700'] });
        setTimeout(onComplete, 1500);
    };

    return (
        <section className="py-20 flex flex-col items-center justify-center min-h-[700px] relative overflow-hidden bg-gradient-to-b from-transparent to-pink-50/30">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-dreamy text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-8 text-center drop-shadow-sm px-4"
            >
                Thổi nến ước nguyện ✨
            </motion.h2>

            <AnimatePresence mode="wait">
                {!isAgeSet ? (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="glass-premium p-12 rounded-[60px] shadow-[0_30px_100px_rgba(236,72,153,0.2)] border border-white/40 flex flex-col items-center gap-10 max-w-sm w-full mx-4"
                    >
                        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-4xl animate-bounce">🎂</div>
                        <p className="text-gray-800 font-dreamy text-3xl text-center leading-tight">
                            "Năm nay Công chúa bao nhiêu tuổi rồi nhỉ?"
                        </p>
                        <form onSubmit={handleSetAge} className="flex flex-col gap-6 w-full">
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="??"
                                className="w-full bg-white/80 border-2 border-pink-200 rounded-3xl px-6 py-5 focus:outline-none focus:border-pink-400 text-center text-5xl font-bold text-pink-600 shadow-inner"
                            />
                            {error && <p className="text-red-400 text-center text-sm font-medium italic">{error}</p>}
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 10px 20px rgba(236,72,153,0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-5 rounded-3xl font-bold text-2xl shadow-lg transition-all"
                            >
                                Xác nhận 🎉
                            </motion.button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="cake"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4 w-full max-w-6xl"
                    >
                        {/* Instruction Text or Celebration Text */}
                        <div className="h-12 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {allBlownOut ? (
                                    <motion.p
                                        key="celebration"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1.2 }}
                                        className="text-pink-500 font-dreamy text-4xl md:text-5xl font-bold drop-shadow-md text-center"
                                    >
                                        🎂 Happy Birthday! 🎂
                                    </motion.p>
                                ) : (
                                    !showFan && (
                                        <motion.p
                                            key="instruction"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="text-pink-600 font-dreamy text-2xl animate-bounce"
                                        >
                                            👇 Bấm vào từng cây nến để thắp sáng nhé! 👇
                                        </motion.p>
                                    )
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative flex flex-col md:flex-row items-center justify-center gap-24 w-full">

                            {/* CAKE VISUAL (NEW PREMIUM 3D STYLE) */}
                            <div className="relative w-80 h-80 md:w-[600px] md:h-[600px] flex items-end justify-center perspective-[1000px]">

                                {/* Wind Effects */}
                                <AnimatePresence>
                                    {isFanOn && (
                                        <div className="absolute inset-0 pointer-events-none z-[100] flex items-center justify-end overflow-hidden pr-20">
                                            {[...Array(12)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ x: 0, opacity: 0 }}
                                                    animate={{ x: -1200, opacity: [0, 0.8, 0], scale: [1, 1.5, 1] }}
                                                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.08 }}
                                                    className="h-[2px] bg-gradient-to-r from-white/80 to-transparent absolute blur-[1px]"
                                                    style={{ top: `${20 + i * 5}%`, width: `${150 + Math.random() * 300}px` }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </AnimatePresence>

                                {/* Candles Container */}
                                <div className="absolute top-[25%] left-0 right-0 flex items-center justify-center pointer-events-none z-50">
                                    {candles.map((candle) => (
                                        <motion.div
                                            key={candle.id}
                                            onClick={() => lightCandle(candle.id)}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: candle.delay, type: 'spring', damping: 12 }}
                                            className="absolute cursor-pointer pointer-events-auto"
                                            style={{
                                                x: candle.x,
                                                y: candle.y,
                                                rotate: `${candle.rotate}deg`,
                                                zIndex: candle.z
                                            }}
                                        >
                                            <div className="relative flex flex-col items-center">
                                                {/* Realistic Flame */}
                                                <AnimatePresence>
                                                    {candle.isLit && (
                                                        <motion.div
                                                            key={`flame-container-${candle.id}`}
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 0.8, opacity: 1 }}
                                                            exit={{ scale: 0, opacity: 0, y: -20, filter: 'blur(10px)' }}
                                                            className="absolute -top-9 flex flex-col items-center pointer-events-none"
                                                        >
                                                            {/* Outer Glow */}
                                                            <motion.div
                                                                animate={{
                                                                    scale: [1, 1.2, 1],
                                                                    opacity: [0.3, 0.5, 0.3],
                                                                }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                className="absolute w-12 h-16 bg-orange-500 rounded-full blur-xl -top-2"
                                                            />

                                                            {/* Main Dancing Flame */}
                                                            <motion.div
                                                                animate={{
                                                                    scaleY: [1, 1.1, 0.9, 1.15, 1],
                                                                    scaleX: [1, 0.9, 1.1, 0.85, 1],
                                                                    rotate: [0, 2, -2, 1, 0],
                                                                    x: [0, 1, -1, 0.5, 0]
                                                                }}
                                                                transition={{
                                                                    duration: 0.6,
                                                                    repeat: Infinity,
                                                                    ease: "easeInOut"
                                                                }}
                                                                className="relative w-5 h-10 bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-200 rounded-full blur-[0.2px] shadow-[0_0_15px_rgba(255,165,0,0.6)]"
                                                                style={{ borderRadius: '50% 50% 20% 20% / 80% 80% 20% 20%' }}
                                                            >
                                                                {/* Inner Core */}
                                                                <motion.div
                                                                    animate={{
                                                                        scaleY: [1, 1.05, 0.95, 1],
                                                                        opacity: [0.8, 1, 0.8]
                                                                    }}
                                                                    transition={{ duration: 0.4, repeat: Infinity }}
                                                                    className="absolute inset-x-0 bottom-2 mx-auto w-2 h-5 bg-white rounded-full blur-[1px]"
                                                                />
                                                            </motion.div>

                                                            {/* Blue base */}
                                                            <div className="w-3 h-2 bg-blue-500/40 rounded-full blur-sm -mt-2" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Smoke */}
                                                <AnimatePresence>
                                                    {!candle.isLit && candle.wasLit && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 0 }}
                                                            animate={{ opacity: [0, 0.6, 0], y: -50, scale: [1, 2.5] }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 2 }}
                                                            className="absolute -top-6 w-4 h-4 bg-white/40 blur-lg rounded-full"
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                {/* Wick */}
                                                <div className="w-[2px] h-3 bg-zinc-800 rounded-full -mb-[1px] relative z-0">
                                                    <div className="absolute top-0 w-full h-full bg-white/20" />
                                                </div>

                                                {/* Wax Body */}
                                                <div
                                                    className="w-4 h-14 rounded-full shadow-lg relative border border-white/20"
                                                    style={{ background: candle.color }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-black/20 rounded-full" />
                                                    <div className="absolute top-0 w-full h-1 bg-white/30 rounded-full" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CAKE LAYERS (ENHANCED PREMIUM STYLE) */}
                                <div className="relative w-[300px] md:w-[480px] h-[350px] flex flex-col items-center justify-end z-10">

                                    {/* Top Layer */}
                                    <div className="relative z-30 group">
                                        {/* Cream Dollops */}
                                        <div className="absolute -top-3 left-0 right-0 flex justify-between px-2 z-20">
                                            {[...Array(7)].map((_, i) => (
                                                <div key={i} className="w-8 h-8 bg-white rounded-full shadow-inner" style={{ transform: `scale(${1 + Math.random() * 0.2})` }} />
                                            ))}
                                        </div>

                                        <div className="w-[180px] md:w-[280px] h-[80px] bg-[#fff0f5] rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.1)] relative overflow-hidden border-b-8 border-pink-200">
                                            {/* Strawberries on top - More stylized */}
                                            <div className="absolute inset-0 flex items-center justify-around px-8 mt-[-15px]">
                                                {['🍓', '🍓', '🍓'].map((s, i) => (
                                                    <motion.div key={i} whileHover={{ scale: 1.2, rotate: 15 }} className="relative">
                                                        <span className="text-4xl filter drop-shadow-md block">{s}</span>
                                                        <div className="absolute bottom-0 left-1 w-full h-1 bg-black/20 blur-sm rounded-full" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-pink-100" />
                                        </div>

                                        {/* Drips Layer */}
                                        <div className="w-[180px] md:w-[280px] h-[70px] bg-[#fff0f5] -mt-[40px] rounded-b-[40px] relative border-x-4 border-pink-50 flex justify-between px-2 z-10 shadow-inner">
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-10 bg-[#fff0f5] rounded-b-full shadow-sm border-b border-pink-100"
                                                    style={{
                                                        height: `${40 + Math.random() * 30}px`,
                                                        marginTop: '-2px'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Middle Layer - Ribbon Style */}
                                    <div className="relative z-20 -mt-10">
                                        <div className="w-[240px] md:w-[380px] h-[100px] bg-gradient-to-r from-pink-200 via-pink-300 to-pink-200 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative overflow-hidden border-b-[8px] border-pink-400">
                                            {/* Ribbon */}
                                            <div className="absolute top-[40%] w-full h-4 bg-pink-500/80 shadow-sm" />
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
                                        </div>
                                        <div className="w-[240px] md:w-[380px] h-[80px] bg-pink-100 -mt-[50px] rounded-b-[50px] relative border-x-2 border-pink-200 shadow-inner" />
                                    </div>

                                    {/* Bottom Layer - Textured */}
                                    <div className="relative z-10 -mt-14">
                                        <div className="w-[300px] md:w-[500px] h-[120px] bg-gradient-to-b from-blue-100 to-blue-200 rounded-full shadow-2xl relative overflow-hidden border-b-[10px] border-blue-300">
                                            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_12px)]" />
                                        </div>
                                        <div className="w-[300px] md:w-[500px] h-[100px] bg-blue-50 -mt-[60px] rounded-b-[60px] relative border-x-2 border-blue-100 flex items-center justify-around px-10 shadow-inner">
                                            {/* Decorative Pearls */}
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-white to-gray-200 shadow-md border border-gray-100" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Plate */}
                                    <div className="w-[360px] md:w-[620px] h-20 bg-white/90 backdrop-blur-xl rounded-full -mt-10 shadow-[0_30px_70px_rgba(0,0,0,0.3)] border-[6px] border-gray-100 relative z-0">
                                        <div className="absolute inset-2 rounded-full border-2 border-dashed border-pink-200" />
                                    </div>
                                </div>
                            </div>

                            {/* FAN CONTROLLER (PREMIUM STYLE) */}
                            <AnimatePresence>
                                {showFan && !allBlownOut && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="flex flex-col items-center gap-10"
                                    >
                                        <div className="relative w-56 h-80 flex flex-col items-center">
                                            {/* Premium Fan Head */}
                                            <div className="w-48 h-48 bg-white rounded-full relative shadow-2xl border-x-8 border-pink-50 flex items-center justify-center p-4">
                                                <div className="absolute inset-0 border-[10px] border-zinc-100 rounded-full" />
                                                <motion.div
                                                    animate={{ rotate: isFanOn ? 720 : 0 }}
                                                    transition={{ duration: 0.5, repeat: isFanOn ? Infinity : 0, ease: "linear" }}
                                                    className="w-full h-full relative"
                                                >
                                                    {[...Array(3)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="absolute w-16 h-24 bg-gradient-to-b from-zinc-200 to-zinc-100 rounded-[80%_80%_40%_40%] top-[-10px] left-1/2 -ml-8 origin-bottom border border-zinc-200"
                                                            style={{ rotate: `${i * 120}deg` }}
                                                        />
                                                    ))}
                                                    <div className="absolute inset-0 m-auto w-10 h-10 bg-white shadow-xl rounded-full border-4 border-pink-200 z-10" />
                                                </motion.div>
                                                {/* Wind exit arrows */}
                                                <AnimatePresence>
                                                    {isFanOn && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="absolute -left-12 top-10 flex flex-col gap-4"
                                                        >
                                                            {[...Array(3)].map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    animate={{ x: [-20, -60], opacity: [0, 1, 0] }}
                                                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                                                                    className="text-white drop-shadow-lg text-4xl"
                                                                >
                                                                    💨
                                                                </motion.div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            {/* Stand */}
                                            <div className="w-10 h-20 bg-gradient-to-r from-zinc-200 via-zinc-50 to-zinc-200 -mt-2 shadow-inner" />
                                            {/* Base & Switch */}
                                            <div className="w-40 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center border-t border-white">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => {
                                                        setIsFanOn(!isFanOn);
                                                        playSound(isFanOn ? 'pop' : 'magic');
                                                    }}
                                                    className={`w-20 h-10 rounded-full border-2 border-white shadow-inner relative transition-all duration-500 overflow-hidden ${isFanOn ? 'bg-green-400' : 'bg-pink-400'}`}
                                                >
                                                    <motion.div
                                                        animate={{ x: isFanOn ? 40 : 0 }}
                                                        className="absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center text-[10px] font-black"
                                                    >
                                                        {isFanOn ? 'ON' : 'OFF'}
                                                    </motion.div>
                                                </motion.button>
                                            </div>
                                            <span className="mt-4 font-dreamy text-pink-600 font-bold tracking-widest text-lg uppercase italic animate-pulse">Bật quạt thôi! ✨</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>

                        {/* Celebratory CTA or Progress Bar */}
                        <div className="text-center w-full max-w-xl pb-20">
                            <AnimatePresence mode="wait">
                                {allBlownOut ? (
                                    <motion.button
                                        key="final-btn"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(236,72,153,0.6)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleFinalExplosion}
                                        className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 text-white px-16 py-8 rounded-[40px] font-black text-3xl shadow-2xl uppercase tracking-tighter"
                                    >
                                        BÙM CHÍU TẶNG QUÀ! 🧨 🎁
                                    </motion.button>
                                ) : (
                                    <motion.div key="progress" className="space-y-6">
                                        <p className="text-pink-600 font-dreamy text-3xl font-bold tracking-tight">
                                            {litCount === 20
                                                ? "Sẵn sàng nhận quà chưa? Bật quạt đi nào! 🌬️"
                                                : `Thắp nến ước nguyện nhé: ${litCount}/20 ✨`}
                                        </p>
                                        <div className="w-full h-10 bg-white/50 backdrop-blur-md border border-white/40 rounded-full overflow-hidden shadow-inner p-1">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(litCount / 20) * 100}%` }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Optimized Background Decorations */}
            <div className="absolute inset-0 pointer-events-none opacity-30 select-none">
                {useMemo(() => [...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -100, 0],
                            rotate: [0, 360],
                            opacity: [0.3, 0.7, 0.3],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute text-3xl select-none"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    >
                        {['✨', '🌸', '💖', '🧸', '🍭'][i % 5]}
                    </motion.div>
                )), [])}
            </div>

            <style jsx="true">{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .perspective-[1000px] {
                    perspective: 1000px;
                }
            `}</style>
        </section>
    );
};

export default BirthdayCake;
