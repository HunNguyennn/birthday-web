import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Check, RefreshCw, Aperture, Download, Palette, Image as ImageIcon } from 'lucide-react';
import { playSound } from '../utils/sounds';

const FILTERS = [
    { name: 'Normal', class: 'brightness-100 contrast-100 sepia-0 grayscale-0 saturate-100', filter: 'brightness(1.0) contrast(1.0) sepia(0) grayscale(0) saturate(1.0)' },
    { name: 'Dreamy', class: 'brightness-110 contrast-90 sepia-20 saturate-120 hue-rotate-15', filter: 'brightness(1.1) contrast(0.9) sepia(0.2) saturate(1.2) hue-rotate(15deg)' },
    { name: 'Vintage', class: 'sepia contrast-110 brightness-90 grayscale-20', filter: 'sepia(1) contrast(1.1) brightness(0.9) grayscale(0.2)' },
    { name: 'B&W', class: 'grayscale contrast-125', filter: 'grayscale(1) contrast(1.25)' },
    { name: 'Soft', class: 'brightness-105 contrast-95 saturate-85 blur-[0.5px]', filter: 'brightness(1.05) contrast(0.95) saturate(0.85) blur(0.5px)' },
    { name: 'Rose', class: 'sepia-50 hue-rotate-[-30deg] saturate-130 brightness-110', filter: 'sepia(0.5) hue-rotate(-30deg) saturate(1.3) brightness(1.1)' },
];

const FRAMES = [
    {
        name: 'None',
        previewColor: 'bg-gray-200',
        draw: (ctx, w, h) => { }
    },
    {
        name: 'Polaroid',
        previewColor: 'bg-white border-2 border-gray-100',
        draw: (ctx, w, h) => {
            const border = w * 0.05;
            const bottom = h * 0.2;

            ctx.fillStyle = "#ffffff";
            // Draw 4 distinct rectangles to create the frame without covering the center
            ctx.fillRect(0, 0, w, border); // Top
            ctx.fillRect(0, 0, border, h); // Left
            ctx.fillRect(w - border, 0, border, h); // Right
            ctx.fillRect(0, h - bottom, w, bottom); // Bottom

            // Text
            ctx.fillStyle = "#333";
            ctx.font = `italic ${w * 0.05}px serif`;
            ctx.textAlign = "center";
            ctx.fillText("Memories", w / 2, h - bottom / 2 + w * 0.015);
        }
    },
    {
        name: 'Halloween',
        previewColor: 'bg-orange-500',
        draw: (ctx, w, h) => {
            ctx.strokeStyle = "#ff6b00"; // Orange border
            ctx.lineWidth = w * 0.03;
            ctx.strokeRect(0, 0, w, h);

            ctx.fillStyle = "rgba(0,0,0,0.2)"; // Darken effect
            ctx.fillRect(0, 0, w, h);

            ctx.font = `${w * 0.08}px serif`;
            ctx.textAlign = "left";
            ctx.fillStyle = "#fff";
            ctx.fillText("🕷️", w * 0.02, h * 0.1);
            ctx.textAlign = "right";
            ctx.fillText("🕸️", w * 0.98, h * 0.15);
            ctx.textAlign = "left";
            ctx.fillText("🎃", w * 0.02, h * 0.95);
        }
    },
    {
        name: 'Christmas',
        previewColor: 'bg-red-500',
        draw: (ctx, w, h) => {
            // Striped Border
            const stripeWidth = w * 0.04;
            ctx.lineWidth = stripeWidth;
            ctx.strokeStyle = "#ff0000"; // Red
            ctx.strokeRect(0, 0, w, h);
            ctx.strokeStyle = "#008000"; // Green
            ctx.strokeRect(stripeWidth / 2, stripeWidth / 2, w - stripeWidth, h - stripeWidth);

            ctx.font = `${w * 0.08}px serif`;
            ctx.textAlign = "left";
            ctx.fillStyle = "#fff";
            ctx.fillText("🎄", w * 0.02, h * 0.1);
            ctx.textAlign = "right";
            ctx.fillText("❄️", w * 0.98, h * 0.1);
            ctx.textAlign = "center";
            ctx.fillText("🎁", w / 2, h * 0.95);
        }
    },
    {
        name: 'New Year',
        previewColor: 'bg-yellow-400',
        draw: (ctx, w, h) => {
            ctx.strokeStyle = "#ffd700"; // Gold border
            ctx.lineWidth = w * 0.03;
            ctx.strokeRect(w * 0.02, h * 0.02, w * 0.96, h * 0.96);

            ctx.fillStyle = "#ffd700";
            ctx.font = `bold ${w * 0.07}px serif`;
            ctx.textAlign = "center";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 4;
            ctx.fillText("HAPPY NEW YEAR", w / 2, h * 0.1);
            ctx.shadowBlur = 0; // Reset shadow
            ctx.fillText("✨", w * 0.1, h * 0.9);
            ctx.fillText("✨", w * 0.9, h * 0.9);
        }
    },
    {
        name: 'Vintage',
        previewColor: 'bg-gray-700',
        draw: (ctx, w, h) => {
            // Film strip perforations
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            const perfSize = w * 0.02;
            const perfSpacing = w * 0.03;

            // Top perforations
            for (let x = perfSpacing; x < w - perfSpacing; x += perfSpacing) {
                ctx.fillRect(x - perfSize / 2, 0, perfSize, perfSize);
            }
            // Bottom perforations
            for (let x = perfSpacing; x < w - perfSpacing; x += perfSpacing) {
                ctx.fillRect(x - perfSize / 2, h - perfSize, perfSize, perfSize);
            }
            // Left perforations
            for (let y = perfSpacing; y < h - perfSpacing; y += perfSpacing) {
                ctx.fillRect(0, y - perfSize / 2, perfSize, perfSize);
            }
            // Right perforations
            for (let y = perfSpacing; y < h - perfSpacing; y += perfSpacing) {
                ctx.fillRect(w - perfSize, y - perfSize / 2, perfSize, perfSize);
            }
        }
    }
];

const PhotoBooth = ({ isOpen, onClose, onSave }) => {
    const [mode, setMode] = useState('camera'); // 'camera' | 'preview'
    const [stream, setStream] = useState(null);
    const [photoData, setPhotoData] = useState(null); // RAW Captured Image
    const [previewUrl, setPreviewUrl] = useState(null); // Composited Image (Filter + Frame)
    const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
    const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
    const [activeTab, setActiveTab] = useState('filter'); // 'filter' | 'frame'
    const [countdown, setCountdown] = useState(null);
    const [caption, setCaption] = useState('');

    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null); // Used for raw capture

    useEffect(() => {
        if (isOpen && mode === 'camera') {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isOpen, mode]);

    // Composite Effect: Runs whenever base photo, filter, or frame changes
    useEffect(() => {
        if (mode === 'preview' && photoData) {
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                // 1. Draw Base Image with Filter
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
                ctx.filter = selectedFilter.filter;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 2. Draw Frame
                ctx.filter = 'none'; // Clear filter for frame drawing
                if (selectedFrame && selectedFrame.draw) {
                    selectedFrame.draw(ctx, canvas.width, canvas.height);
                }

                setPreviewUrl(canvas.toDataURL('image/png'));
            };
            img.src = photoData;
        } else if (mode === 'camera') {
            setPreviewUrl(null); // Clear preview when in camera mode
        }
    }, [photoData, selectedFilter, selectedFrame, mode]);


    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            // Fallback/Error state could go here
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        setCountdown(3);
        const countInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countInterval);
                    captureImage();
                    return null;
                }
                return prev - 1;
            });
            // Optionally play beep sound
        }, 1000);
    };

    // Capture RAW image (No Filter Baked Yet)
    const captureImage = () => {
        playSound('shutter');
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Flip horizontally
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            setPhotoData(canvas.toDataURL('image/png'));
            setMode('preview');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoData(e.target.result);
                setMode('preview');
                stopCamera();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // Use previewUrl because it already has Filter + Frame baked in!
        if (previewUrl) {
            onSave({ url: previewUrl, caption });
            setCaption('');
            onCloseAndReset();
        }
    };

    const onCloseAndReset = () => {
        setPhotoData(null);
        setPreviewUrl(null);
        setMode('camera');
        setSelectedFilter(FILTERS[0]);
        setSelectedFrame(FRAMES[0]);
        setCaption('');
        setActiveTab('filter'); // Reset tab to filter
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row"
                    >
                        {/* Main Area */}
                        <div className="flex-1 relative bg-gray-100 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
                            {mode === 'camera' ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="absolute w-full h-full object-cover scale-x-[-1]"
                                    />
                                    <canvas ref={canvasRef} className="hidden" />

                                    {countdown && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
                                            <motion.span
                                                key={countdown}
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1.5, opacity: 1 }}
                                                className="text-white text-9xl font-bold drop-shadow-lg"
                                            >
                                                {countdown}
                                            </motion.span>
                                        </div>
                                    )}

                                    <div className="absolute bottom-6 w-full flex justify-center items-center gap-8 z-20">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-colors"
                                            title="Upload Photo"
                                        >
                                            <Upload size={24} />
                                        </button>
                                        <button
                                            onClick={takePhoto}
                                            className="p-1 rounded-full border-4 border-white/50 hover:scale-105 transition-transform"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-200" />
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="relative w-full h-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                    {/* Show the Composited Image */}
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-h-[70vh] max-w-full object-contain shadow-lg"
                                        />
                                    )}
                                </div>
                            )}

                            <button
                                onClick={onCloseAndReset}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 z-30"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Sidebar / Controls */}
                        <div className="w-full md:w-80 bg-white p-6 flex flex-col gap-6 border-l border-gray-100">
                            <div>
                                <h3 className="font-dreamy text-2xl text-pink-500 mb-1">
                                    {mode === 'camera' ? 'Chụp ảnh nào!' : 'Chỉnh sửa'}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {mode === 'camera' ? 'Cười tươi lên nhé công chúa 😊' : 'Thêm khung & màu sắc ✨'}
                                </p>
                            </div>

                            {mode === 'preview' && (
                                <div className="flex-1 overflow-y-auto flex flex-col gap-4">
                                    {/* Tabs - Fixed Grid for Equal Sizing */}
                                    <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-xl w-full">
                                        <button
                                            onClick={() => setActiveTab('filter')}
                                            className={`flex - 1 flex items - center justify - center gap - 2 py - 2 rounded - lg text - sm font - medium transition - all ${activeTab === 'filter' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-500 hover:text-gray-700'} `}
                                        >
                                            <Palette size={16} /> Bộ lọc
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('frame')}
                                            className={`flex - 1 flex items - center justify - center gap - 2 py - 2 rounded - lg text - sm font - medium transition - all ${activeTab === 'frame' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-500 hover:text-gray-700'} `}
                                        >
                                            <ImageIcon size={16} /> Khung
                                        </button>
                                    </div>

                                    {/* Grid Content */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {activeTab === 'filter' ? (
                                            FILTERS.map((filter) => (
                                                <button
                                                    key={filter.name}
                                                    onClick={() => setSelectedFilter(filter)}
                                                    className={`p - 2 rounded - lg border - 2 transition - all ${selectedFilter.name === filter.name
                                                        ? 'border-pink-500 bg-pink-50'
                                                        : 'border-transparent hover:bg-gray-50'
                                                        } `}
                                                >
                                                    <div className={`w - full h - 20 rounded - md mb - 2 overflow - hidden`}>
                                                        <div className={`w - full h - full bg - gray - 200 ${filter.class} `}>
                                                            {/* Use photoData for filter preview, as the filter is applied via CSS class */}
                                                            {photoData && (
                                                                <img src={photoData} className="w-full h-full object-cover" alt="" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{filter.name}</span>
                                                </button>
                                            ))
                                        ) : (
                                            FRAMES.map((frame) => (
                                                <button
                                                    key={frame.name}
                                                    onClick={() => setSelectedFrame(frame)}
                                                    className={`p - 2 rounded - lg border - 2 transition - all ${selectedFrame.name === frame.name
                                                        ? 'border-pink-500 bg-pink-50'
                                                        : 'border-transparent hover:bg-gray-50'
                                                        } `}
                                                >
                                                    <div className={`w - full h - 20 rounded - md mb - 2 overflow - hidden bg - gray - 100 relative ${frame.previewColor} flex items - center justify - center`}>
                                                        {/* Simple visual rep of frame */}
                                                        <span className="text-2xl opacity-50">🖼️</span>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{frame.name}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>

                                    <div className="mt-2 pt-4 border-t border-gray-100">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Chú thích của bạn</label>
                                        <textarea
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                            placeholder="Viết gì đó thật dễ thương..."
                                            className="w-full px-3 py-2 rounded-xl border-2 border-gray-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none text-sm resize-none transition-all placeholder:text-gray-300"
                                            rows={2}
                                            maxLength={50}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto flex flex-col gap-3">
                                {mode === 'preview' ? (
                                    <>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setMode('camera')}
                                                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <RefreshCw size={18} /> Retry
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.download = `princess - photo - ${Date.now()}.png`;
                                                    link.href = previewUrl || photoData; // Download composited if available, else raw
                                                    link.click();
                                                }}
                                                className="p-3 rounded-xl border border-pink-200 text-pink-500 hover:bg-pink-50 transition-colors"
                                                title="Tải ảnh về máy"
                                            >
                                                <Download size={20} />
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="flex-[2] py-3 px-4 rounded-xl bg-pink-500 text-white font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                            >
                                                <Check size={18} /> Lưu ảnh
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-xs text-gray-400">
                                        Cho phép truy cập camera để chụp ảnh nhé!
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PhotoBooth;
