import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, X, ExternalLink } from 'lucide-react';
import { getGoogleDriveDirectLink, getGoogleDrivePreviewLink } from '../utils/googleDrive';

const VIDEOS = [
    {
        id: 1,
        title: "Đi đèo Hải Vân nè",
        url: "https://drive.google.com/file/d/1NYkCqpWjhbAUMPJDfRFzCAEaYOwYMAeu/view?usp=drive_link",
        color: "from-pink-400 to-rose-400"
    },
    {
        id: 2,
        title: "Biển An Bàng",
        url: "https://drive.google.com/file/d/1ZyRe6ScaKek_wFz5gP9Nwb0a0c5l-t8F/view?usp=sharing",
        color: "from-purple-400 to-indigo-400"
    },
    {
        id: 3,
        title: "Đi chụp photobooth nè",
        url: "https://drive.google.com/file/d/1cHUa2-HRTnyFlT45ZYCVGbp0GyNZ8ssA/view?usp=drive_link",
        color: "from-blue-400 to-cyan-400"
    },
    {
        id: 4,
        title: "Nó cứ phải gọi là dầu nhớt",
        url: "https://drive.google.com/file/d/1J6Z20IRnXbpr2GS9-c41oOKv8nkKwl_7/view?usp=drive_link",
        color: "from-amber-400 to-orange-400"
    }
];

const VideoGallery = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <section className="py-20 px-4 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center justify-center gap-3 mb-12">
                    <Film className="text-pink-500 w-8 h-8 md:w-10 md:h-10 animate-bounce" />
                    <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800 font-dreamy">
                        Rạp Chiếu Phim Kỉ Liệm
                    </h2>
                    <Film className="text-pink-500 w-8 h-8 md:w-10 md:h-10 animate-bounce" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {VIDEOS.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, translateY: -5 }}
                            className="group relative block cursor-pointer"
                            onClick={() => setSelectedVideo(video)}
                        >
                            {/* Film Frame Design */}
                            <div className="bg-gray-900 p-3 rounded-lg shadow-xl transform transition-transform duration-300 group-hover:shadow-2xl">
                                {/* Film Holes Top */}
                                <div className="flex justify-between px-2 mb-2 opacity-50">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={`t-${i}`} className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gray-200/20" />
                                    ))}
                                </div>

                                {/* Thumbnail Area */}
                                <div className={`aspect-[9/16] md:aspect-video rounded-md overflow-hidden relative bg-gradient-to-br ${video.color} group-hover:brightness-110 transition-all`}>

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            <Play className="w-8 h-8 text-white ml-1 fill-current" />
                                        </div>
                                    </div>

                                    {/* Decorative Text */}
                                    <div className="absolute bottom-4 left-0 w-full text-center text-white font-bold text-lg drop-shadow-md px-2">
                                        {video.title}
                                    </div>
                                </div>

                                {/* Film Holes Bottom */}
                                <div className="flex justify-between px-2 mt-2 opacity-50">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={`b-${i}`} className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gray-200/20" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-8 text-gray-500 italic text-sm">
                    *Bấm vào để xem video chiếu ngay tại đây nhé! 🍿
                </div>
            </div>

            {/* Cinema Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 100 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.5, y: 100 }}
                            className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-gray-800"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <iframe
                                src={getGoogleDrivePreviewLink(selectedVideo.url)}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-red-500 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors border border-white/20"
                            >
                                <X size={24} />
                            </button>

                            {/* Fallback Link */}
                            <a
                                href={selectedVideo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-pink-600 backdrop-blur-md text-white rounded-full text-sm font-medium transition-colors border border-white/10"
                            >
                                <ExternalLink size={16} /> Mở gốc
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </section>
    );
};

export default VideoGallery;
