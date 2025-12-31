const soundGallery = {
    bubble: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Cute pop
    magic: 'https://assets.mixkit.co/active_storage/sfx/1497/1497-preview.mp3', // Sparkly
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Chime
    redeem: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3', // Happy pop
    explosion: 'https://assets.mixkit.co/active_storage/sfx/1497/1497-preview.mp3' // Same as magic for now
};

const audioPool = {};

// Preload
Object.keys(soundGallery).forEach(key => {
    audioPool[key] = new Audio(soundGallery[key]);
    audioPool[key].load();
});

export const playSound = (type) => {
    if (audioPool[type]) {
        const sound = audioPool[type].cloneNode();
        sound.volume = 0.4;
        sound.play().catch(() => { });
    }
};
