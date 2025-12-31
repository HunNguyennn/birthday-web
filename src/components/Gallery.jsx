import React from 'react';
import { motion } from 'framer-motion';

const images = [
    {
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
        caption: "ẢNH LÚC ĐANG CƯỜI (Cười híp cả mắt luôn 😄)",
        rotation: "2deg"
    },
    {
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800",
        caption: "ẢNH XINH ĐẸP NHẤT (Thần thái không đùa được đâu ✨)",
        rotation: "-1deg"
    }
];

const Gallery = () => {
    return (
        <div className="py-20 px-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-700 text-center mb-12 uppercase tracking-widest">
                Khoảnh khắc đáng yêu (và đáng ghét)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {images.map((img, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                        style={{ rotate: img.rotation }}
                        className="relative bg-white p-4 shadow-xl border border-gray-100 group cursor-pointer"
                    >
                        {/* Scrapbook/Polaroid look */}
                        <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-4">
                            <img
                                src={img.url}
                                alt={img.caption}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        <div className="text-center font-dreamy text-xl text-gray-700">
                            {img.caption.split('(')[0]}
                            <div className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-pink-500 font-sans mt-1">
                                ({img.caption.split('(')[1]}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <p className="text-center text-gray-400 mt-12 italic">
                *Mẹo: Thêm ảnh vào public/images để thay đổi nhé!
            </p>
        </div>
    );
};

export default Gallery;
