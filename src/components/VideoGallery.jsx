import React from 'react';
import { motion } from 'framer-motion';
import { Play, Film } from 'lucide-react';

const VIDEOS = [
    {
        id: 1,
        title: "Kỉ niệm xinh đẹp 1",
        url: "https://1024terabox.com/s/1LnL56Mnud1E-eBOUon-xdA",
        color: "from-pink-400 to-rose-400"
    },
    {
        id: 2,
        title: "Kỉ niệm xinh đẹp 2",
        url: "https://1024terabox.com/s/1qIj5k1mSfnzv3_dPz_1hnA",
        color: "from-purple-400 to-indigo-400"
    },
    {
        id: 3,
        title: "Kỉ niệm xinh đẹp 3",
        url: "https://1024terabox.com/s/1BajBNCDWmh8mNXFVJtmdqA",
        color: "from-blue-400 to-cyan-400"
    },
    {
        id: 4,
        title: "Kỉ niệm xinh đẹp 4",
        url: "https://1024terabox.com/s/1UOet-GDlfqVKY1Cl3chLdQ",
        color: "from-amber-400 to-orange-400"
    }
];

const VideoGallery = () => {
    return (
        <section className="py-20 px-4 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center justify-center gap-3 mb-12">
                    <Film className="text-pink-500 w-8 h-8 md:w-10 md:h-10 animate-bounce" />
                    <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800 font-dreamy">
                        Rạp Chiếu Phim Tình Yêu
                    </h2>
                    <Film className="text-pink-500 w-8 h-8 md:w-10 md:h-10 animate-bounce" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {VIDEOS.map((video, index) => (
                        <motion.a
                            key={video.id}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, translateY: -5 }}
                            className="group relative block"
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
                        </motion.a>
                    ))}
                </div>

                <div className="text-center mt-8 text-gray-500 italic text-sm">
                    *Bấm vào để xem video chất lượng cao trên Terabox nhé! 🍿
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </section>
    );
};

export default VideoGallery;
