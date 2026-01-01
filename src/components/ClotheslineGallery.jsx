import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Trash2, Pencil, Download, X } from 'lucide-react';
import { playSound } from '../utils/sounds';
import { getGoogleDriveImageLink } from '../utils/googleDrive';
import PhotoBooth from './PhotoBooth';

const DEFAULT_IMAGES = [
    {
        id: "default-1",
        url: "https://drive.google.com/file/d/1DALw42Bgx2pDVF5dPvCfhWNPoaJtMG1r/view?usp=drive_link",
        caption: "Dễ thương zậy béee 😄",
        rotation: -4
    },
    {
        id: "default-2",
        url: "https://drive.google.com/file/d/1LFUQaugHbRFgcgAmfmcd56dQuDX047wj/view?usp=drive_link",
        caption: "Có thể là dựng được luôn 😄",
        rotation: 5
    },
    {
        id: "default-3",
        url: "https://drive.google.com/file/d/14GpP1VkMb9ZLDdp_hAaMrjLbz-AfviIK/view?usp=drive_link",
        caption: "Thần thái không đùa được đâu ✨",
        rotation: -3
    },
    {
        id: "default-4",
        url: "https://drive.google.com/file/d/1HSJKVpRXfCSJD3VEY1fiQ7nqrRklWiYc/view?usp=drive_link",
        caption: "Nhìn không ra người yêu mình lun 😤",
        rotation: 4
    },
    {
        id: "default-5",
        url: "https://drive.google.com/file/d/1ocACwG0aZV-ENBFpGoz1YDb3H8Aoj7jA/view?usp=drive_link",
        caption: "Cổ cũng yêu nước dữ dằn 🇻🇳 😤",
        rotation: -2
    },
    {
        id: "default-6",
        url: "https://drive.google.com/file/d/1BmlDhM6e2AZ69cNE9dSABvOI0xeFCea4/view?usp=drive_link",
        caption: "Xinh quá gái iu ơi 😤",
        rotation: 3
    },
    {
        id: "default-7",
        url: "https://drive.google.com/file/d/1-7m86dYbmcic8kzbwMRpcQjl8LRGXeHv/view?usp=drive_link",
        caption: "Đẹp quá gái iu ơi 😤",
        rotation: -3
    },
    {
        id: "default-8",
        url: "https://drive.google.com/file/d/1R7bBQEH9IGBSwa39KZHzBQWlhPRVimUR/view?usp=drive_link",
        caption: "Củ nghệ của anh",
        rotation: 5
    },
];

const ClotheslineGallery = () => {
    const constraintsRef = useRef(null);
    const [galleryImages, setGalleryImages] = useState(DEFAULT_IMAGES);
    const [isPhotoBoothOpen, setIsPhotoBoothOpen] = useState(false);
    const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [editTargetId, setEditTargetId] = useState(null);
    const [editCaption, setEditCaption] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('princess_gallery_photos');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure legacy saved items have IDs if missing
                const sanitized = parsed.map((img, idx) => ({
                    ...img,
                    id: img.id || `saved-${Date.now()}-${idx}`
                }));
                // Append saved to defaults
                setGalleryImages([...DEFAULT_IMAGES, ...sanitized]);
            } catch (e) {
                console.error("Failed to load photos", e);
            }
        }
    }, []);

    // Dynamically calculate drag width based on number of items
    useEffect(() => {
        // Actual Card width (w-80 = 20rem = 320px) + Gap (gap-24 = 6rem = 96px)
        const itemStride = 416;
        const paddingLeft = window.innerWidth * 0.2; // 20% padding
        const paddingRight = window.innerWidth * 0.2; // Match left padding

        const totalContentWidth = (galleryImages.length * itemStride) + paddingLeft + paddingRight;

        // Calculate max negative scroll (how far left we can go)
        // If content is smaller than screen, we set left to 0 (no scrolling needed or centered behavior preferred)
        // Otherwise, it's -(totalWidth - screenWidth)
        let maxScroll = -(totalContentWidth - window.innerWidth);

        // Safe cap
        if (maxScroll > 0) maxScroll = 0;

        setDragConstraints({ left: maxScroll, right: 0 });
    }, [galleryImages]);

    const handleSavePhoto = (newPhotoData) => {
        const url = typeof newPhotoData === 'string' ? newPhotoData : newPhotoData.url;
        const caption = (typeof newPhotoData === 'object' && newPhotoData.caption) ? newPhotoData.caption : "Ảnh mới chụp nè 📸";

        const newImage = {
            id: `photo-${Date.now()}`,
            url,
            caption,
            rotation: Math.random() * 10 - 5,
            isNew: true
        };

        const updatedImages = [...galleryImages, newImage];
        setGalleryImages(updatedImages);

        const userPhotos = updatedImages.filter(img => img.isNew);
        try {
            localStorage.setItem('princess_gallery_photos', JSON.stringify(userPhotos));
        } catch (e) {
            alert("Bộ nhớ lưu trữ tạm thời đã đầy! Ảnh này sẽ không được lưu nếu bạn tải lại trang.");
            console.error("LocalStorage quota exceeded", e);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteTargetId(id);
    };

    const confirmDelete = () => {
        if (!deleteTargetId) return;

        const updatedImages = galleryImages.filter(img => img.id !== deleteTargetId);
        setGalleryImages(updatedImages);

        const userPhotos = updatedImages.filter(img => img.isNew);
        try {
            localStorage.setItem('princess_gallery_photos', JSON.stringify(userPhotos));
        } catch (e) {
            console.error("Failed to update storage", e);
        }

        setDeleteTargetId(null);
    };

    const handleEditClick = (img) => {
        setEditTargetId(img.id);
        setEditCaption(img.caption);
    };

    const saveEdit = () => {
        if (!editTargetId) return;

        const updatedImages = galleryImages.map(img =>
            img.id === editTargetId ? { ...img, caption: editCaption } : img
        );
        setGalleryImages(updatedImages);

        const userPhotos = updatedImages.filter(img => img.isNew);
        try {
            localStorage.setItem('princess_gallery_photos', JSON.stringify(userPhotos));
        } catch (e) {
            alert("Không thể lưu chỉnh sửa do bộ nhớ đầy!");
        }

        setEditTargetId(null);
        setEditCaption('');
    };

    const handleDownload = (img) => {
        const link = document.createElement('a');
        link.href = img.url;
        link.download = `princess-photo-${img.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="py-24 overflow-hidden relative min-h-[750px] flex flex-col">
            {/* Cuter Rope / Twine - Midpoint of Clothespins (~250px) */}
            <div className="absolute top-[320px] left-0 w-[200%] h-1 bg-[#d4b9a0] shadow-sm z-0 -translate-x-1/4 rotate-[-0.5deg]">
                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,#c3a07a,#c3a07a_8px,#d4b9a0_8px,#d4b9a0_16px)] opacity-60" />
            </div>

            <div className="w-full flex flex-col items-center gap-4 relative z-10 mb-16">
                <h2 className="text-4xl font-dreamy text-pink-600 text-center drop-shadow-sm">
                    Tiệm ảnh "Công chúa" 📸
                </h2>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPhotoBoothOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg text-pink-500 font-bold border-2 border-pink-100 hover:border-pink-300 transition-colors"
                >
                    <Camera size={20} />
                    Chụp ảnh mới
                </motion.button>
            </div>

            <motion.div
                ref={constraintsRef}
                className="flex gap-24 px-[20vw] cursor-grab active:cursor-grabbing pb-20 relative z-10 mt-16 min-w-full w-max"
                drag="x"
                dragConstraints={dragConstraints}
                dragElastic={0.2}
            >
                {galleryImages.map((img, index) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="flex-shrink-0 relative group"
                    >
                        {/* Bow above each clothespin, inside draggable div */}
                        <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 z-40 pointer-events-none">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                                className="text-3xl"
                            >
                                🎀
                            </motion.div>
                        </div>

                        {/* The Clothespin - Now perfectly touching the rope */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-12 z-30 pointer-events-none">
                            <div className="w-4 h-12 bg-[#fdf5e6] border border-[#d2b48c] rounded-sm shadow-md flex flex-col justify-between py-1 relative">
                                <div className="w-full h-[1px] bg-gray-300/50" />
                                <div className="w-full h-1 bg-pink-100/30" />
                                <div className="w-full h-[1px] bg-gray-300/50" />
                                {/* Metal spring exactly at rope depth */}
                                <div className="absolute top-[45%] left-[-2px] w-[120%] h-1 bg-gray-400/40 rounded-full" />
                            </div>
                        </div>

                        <motion.div
                            whileHover={{
                                scale: 1.05,
                                rotate: 0,
                                transition: { duration: 0.3 }
                            }}
                            onClick={() => playSound('bubble')}
                            style={{ rotate: img.rotation }}
                            className="bg-white p-4 pb-12 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-[10px] border-white rounded-sm w-64 md:w-80 cursor-pointer relative"
                        >
                            {/* Action Toolbar - Visible on Group Hover */}
                            <div
                                className="absolute -top-4 -right-4 z-50 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100"
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(img);
                                    }}
                                    className="bg-white text-blue-500 p-2 rounded-full shadow-md border border-blue-100 hover:bg-blue-50 hover:scale-110 cursor-pointer"
                                    title="Sửa chú thích"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(img);
                                    }}
                                    className="bg-white text-green-500 p-2 rounded-full shadow-md border border-green-100 hover:bg-green-50 hover:scale-110 cursor-pointer"
                                    title="Tải ảnh về"
                                >
                                    <Download size={16} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(img.id);
                                    }}
                                    className="bg-white text-red-500 p-2 rounded-full shadow-md border border-red-100 hover:bg-red-50 hover:scale-110 cursor-pointer"
                                    title="Xóa ảnh này"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="aspect-[4/5] overflow-hidden bg-gray-50 mb-4 shadow-inner">
                                <img
                                    src={getGoogleDriveImageLink(img.url)}
                                    alt={img.caption}
                                    loading="lazy"
                                    className="w-full h-full object-cover pointer-events-none"
                                />
                            </div>
                            <p className="font-dreamy text-2xl text-gray-700 text-center italic leading-tight px-2 min-h-[3rem]">
                                {img.caption}
                            </p>

                            {/* Decorative Tape */}
                            <div className="absolute bottom-2 right-2 text-pink-200 text-xl">
                                ❤️
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="text-center text-pink-400 mt-10 italic font-medium animate-bounce"
            >
                ← Lướt dây thừng để xem thêm →
            </motion.p>

            <PhotoBooth
                isOpen={isPhotoBoothOpen}
                onClose={() => setIsPhotoBoothOpen(false)}
                onSave={handleSavePhoto}
            />

            {/* Custom Delete Confirmation Modal */}
            {deleteTargetId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center border-4 border-pink-100"
                    >
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Xóa ảnh này?</h3>
                        <p className="text-gray-500 mb-6">Bạn có chắc chắn muốn xóa bức ảnh đáng yêu này không?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTargetId(null)}
                                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200"
                            >
                                Xóa luôn
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Caption Modal */}
            {editTargetId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center border-4 border-blue-100"
                    >
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                            <Pencil size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Sửa chú thích</h3>
                        <input
                            type="text"
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl mb-6 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-center"
                            maxLength={40}
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditTargetId(null)}
                                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={saveEdit}
                                className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-200"
                            >
                                Lưu lại
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ClotheslineGallery;
