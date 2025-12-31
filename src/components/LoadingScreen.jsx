import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        "Đang quét mức độ xinh đẹp...",
        "Phát hiện quá tải sự dễ thương (101%)...",
        "Đang chuẩn bị tâm lý để nhận quà...",
        "Đang nạp năng lượng yêu thương...",
        "Chờ tí, sắp xong rồi nè..."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 1000);
                    return 100;
                }
                return prev + 1;
            });
        }, 40);

        const messageTimer = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 1200);

        return () => {
            clearInterval(timer);
            clearInterval(messageTimer);
        };
    }, [onComplete, messages.length]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-pastel-lavender z-50 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl text-center"
            >
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Birthday System Booting...</h2>

                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status:</span>
                    <span className="text-lg font-bold text-pink-500">{progress}%</span>
                </div>

                <motion.p
                    key={messageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-gray-600 font-medium h-8 italic"
                >
                    {messages[messageIndex]}
                </motion.p>
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
