import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

import birthdaySong from './SpotiDownloader.com - SINH NHAT - HIEUTHUHAI.mp3';
// We need to move the cover import here or handle it simply. 
// For now, we'll let the Player handle the default cover if missing, or import it here if possible.
// But importing assets in Context might be tricky if path varies. 
// Actually, let's keep it simple: Player passes the default image, Context just holds data.

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const sourceRef = useRef(null);

    // Playlist State
    const [playlist, setPlaylist] = useState([
        {
            title: "SINH NHẬT",
            artist: "HIEUTHUHAI",
            url: birthdaySong,
            isDefault: true
        }
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [frequencyData, setFrequencyData] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const currentTrack = playlist[currentIndex];

    // Helper to add track
    const addTrack = (track) => {
        setPlaylist(prev => {
            // Avoid duplicates
            if (prev.some(t => t.url === track.url)) return prev;
            return [...prev, track];
        });
    };

    const fadeIntervalRef = useRef(null);

    // Helper to play specific track index
    const playTrack = (index) => {
        if (index >= 0 && index < playlist.length) {
            // Cancel any ongoing fade out
            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
            }
            if (audioRef.current) {
                audioRef.current.volume = 1;
            }

            setCurrentIndex(index);
            setIsPlaying(true);
        }
    };

    // ... setTrack, nextTrack, prevTrack ... (no changes needed if they call playTrack or setState, but better to update if needed)
    // Actually nextTrack/prevTrack use setCurrentIndex directly in previous code, which bypasses the stopFade logic.
    // Let's update those too or consolidate.
    // For now, let's just make sure playTrack (used by BirthdayCake) is robust. 
    // And nextTrack/prevTrack are user interactions, so they should also stop fade.

    const nextTrack = () => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
        if (audioRef.current) audioRef.current.volume = 1;
        setCurrentIndex(prev => (prev + 1) % playlist.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
        if (audioRef.current) audioRef.current.volume = 1;
        setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length);
        setIsPlaying(true);
    };

    // Helper to find and play by URL (compatibility)
    const setTrack = (url) => {
        const idx = playlist.findIndex(t => t.url === url);
        if (idx !== -1) {
            playTrack(idx);
        } else {
            addTrack({ title: "Unknown", artist: "Unknown", url });
            setTimeout(() => {
                // Re-find index
            }, 0);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);

    useEffect(() => {
        // We only initialize AudioContext on the first play to comply with browser policies
        if (isPlaying && !analyserRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const audioCtx = new AudioContext();
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 64;

                const source = audioCtx.createMediaElementSource(audioRef.current);
                source.connect(analyser);
                analyser.connect(audioCtx.destination);

                analyserRef.current = analyser;
                sourceRef.current = source;
                dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
            }
        }

        let animationFrame;
        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio play blocked/interrupted");
                });
            }

            const update = () => {
                if (analyserRef.current && dataArrayRef.current) {
                    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                    setFrequencyData([...dataArrayRef.current]);
                }
                animationFrame = requestAnimationFrame(update);
            };
            update();
        } else {
            audioRef.current.pause();
        }

        return () => cancelAnimationFrame(animationFrame);
    }, [isPlaying, currentTrack.url]); // Re-run if track changes

    const togglePlay = () => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
            if (audioRef.current) audioRef.current.volume = 1;
        }
        setIsPlaying(!isPlaying);
    };

    const pauseWithFade = () => {
        const audio = audioRef.current;
        if (!audio || !isPlaying) return;

        // Clear any existing interval just in case
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

        const fadeDuration = 1500; // ms
        const steps = 30;
        const stepTime = fadeDuration / steps;
        const volStep = audio.volume / steps;

        fadeIntervalRef.current = setInterval(() => {
            if (audio.volume > volStep) {
                audio.volume -= volStep;
            } else {
                // Done fading
                clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
                audio.volume = 0;
                audio.pause();
                setIsPlaying(false);
                // Reset volume for next play
                setTimeout(() => { if (audio) audio.volume = 1; }, 500);
            }
        }, stepTime);
    };

    return (
        <MusicContext.Provider value={{
            isPlaying,
            setIsPlaying,
            togglePlay,
            pauseWithFade,
            audioRef,
            frequencyData,
            currentTime,
            duration,
            currentTrack,
            playlist,
            addTrack,
            playTrack,
            nextTrack,
            prevTrack,
            setTrack
        }}>
            {children}
            <audio
                ref={audioRef}
                src={currentTrack.url}
                crossOrigin="anonymous"
                loop
            />
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);
