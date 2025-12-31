import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { playSound } from '../utils/sounds';
import { FloatingHearts } from './BackgroundEffects';

const BirthdayCheck = ({ onCorrect }) => {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);

    const funnyMessages = [
        "Nhập sai rồi, có phải người yêu tui không đó? 🤔",
        "Ngày sinh của mình mà cũng quên à? Giận luôn giờ! 😤",
        "Thôi xong, chắc là người lạ đột nhập rồi. Gọi cảnh sát đây! 🚔",
        "Quá tam ba bận, lần này mà sai nữa là nhịn trà sữa nhé! 🧋",
        "Thử lại đi nè, tập trung vào! 1/1/200... mấy nhỉ? 🧐"
    ];

    const handleCheck = () => {
        if (day === '1' && month === '1' && year === '2006') {
            playSound('success');
            onCorrect();
        } else {
            playSound('error');
            setError(funnyMessages[attempts % funnyMessages.length]);
            setAttempts(attempts + 1);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-pastel-lavender z-[100] p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <FloatingHearts />
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md glass p-10 rounded-[3rem] shadow-2xl text-center relative z-10"
            >
                <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Lock className="text-pink-500" size={40} />
                </div>

                <h2 className="text-3xl font-dreamy font-bold text-gray-800 mb-2">Xác minh danh tính</h2>
                <p className="text-gray-500 mb-8 font-medium italic text-sm">Nhập ngày sinh của "Công chúa" để mở khóa...</p>

                <div className="flex gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Ngày"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="w-full p-4 bg-white/40 border-2 border-white rounded-2xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder:font-normal placeholder:opacity-50"
                    />
                    <input
                        type="text"
                        placeholder="Tháng"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full p-4 bg-white/40 border-2 border-white rounded-2xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder:font-normal placeholder:opacity-50"
                    />
                    <input
                        type="text"
                        placeholder="Năm"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full p-4 bg-white/40 border-2 border-white rounded-2xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder:font-normal placeholder:opacity-50"
                    />
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.p
                            key={error}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-pink-600 font-bold mb-6 text-sm italic"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheck}
                    className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-pink-200 transition-all uppercase tracking-widest"
                >
                    Mở khóa yêu thương ✨
                </motion.button>
            </motion.div>
        </div>
    );
};

export default BirthdayCheck;
