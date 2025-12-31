import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, CheckCircle } from 'lucide-react';
import { playSound } from '../utils/sounds';

const couponData = [
    {
        id: 1,
        title: "Miễn tội 1 lần",
        desc: "Khi dỗi vô cớ (Hạn dùng: Mãi mãi)",
        color: "bg-blue-100",
        textColor: "text-blue-600"
    },
    {
        id: 2,
        title: "1 chầu trà sữa",
        desc: "Full Topping (Người trả tiền: Anh)",
        color: "bg-pink-100",
        textColor: "text-pink-600"
    },
    {
        id: 3,
        title: "1 lần thắng cãi nhau",
        desc: "Lưu ý: Chỉ dùng khi thực sự cần thiết!",
        color: "bg-purple-100",
        textColor: "text-purple-600"
    }
];

const Coupons = () => {
    const [redeemed, setRedeemed] = useState([]);

    const handleRedeem = (id) => {
        if (!redeemed.includes(id)) {
            playSound('redeem');
            setRedeemed([...redeemed, id]);
        }
    };

    return (
        <div className="py-20 px-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-700 text-center mb-12 uppercase tracking-widest">
                Phiếu Quà Tặng Độc Quyền
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {couponData.map((coupon) => (
                    <motion.div
                        key={coupon.id}
                        whileHover={{ y: -10 }}
                        className={`relative p-6 rounded-2xl glass border-2 border-dashed border-white flex flex-col items-center text-center cursor-pointer transition-shadow hover:shadow-2xl ${coupon.color}`}
                        onClick={() => handleRedeem(coupon.id)}
                    >
                        <AnimatePresence>
                            {redeemed.includes(coupon.id) && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl z-10"
                                >
                                    <div className="flex flex-col items-center text-green-500">
                                        <CheckCircle size={48} />
                                        <span className="font-bold text-xl mt-2 uppercase">Đã Đổi!</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Ticket className={`mb-4 ${coupon.textColor}`} size={40} />
                        <h3 className={`text-xl font-bold mb-2 ${coupon.textColor}`}>{coupon.title}</h3>
                        <p className="text-gray-600 text-sm italic">{coupon.desc}</p>

                        <div className="mt-6 px-4 py-2 bg-white/50 rounded-full text-xs font-bold text-gray-400 border border-white">
                            CLICK TO REDEEM
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Coupons;
