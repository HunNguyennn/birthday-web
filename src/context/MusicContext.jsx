import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

import birthdaySong from './SpotiDownloader.com - SINH NHAT - HIEUTHUHAI.mp3';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const sourceRef = useRef(null);
    const [frequencyData, setFrequencyData] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

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
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;

            const source = audioCtx.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);

            analyserRef.current = analyser;
            sourceRef.current = source;
            dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        }

        let animationFrame;
        if (isPlaying) {
            const update = () => {
                if (analyserRef.current) {
                    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                    setFrequencyData([...dataArrayRef.current]);
                }
                animationFrame = requestAnimationFrame(update);
            };
            update();
        }

        return () => cancelAnimationFrame(animationFrame);
    }, [isPlaying]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play blocked"));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <MusicContext.Provider value={{ isPlaying, setIsPlaying, togglePlay, audioRef, frequencyData, currentTime, duration }}>
            {children}
            <audio
                ref={audioRef}
                src={birthdaySong}
                crossOrigin="anonymous"
                loop
            />
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);
