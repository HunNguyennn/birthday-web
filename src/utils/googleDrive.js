/**
 * Converts a Google Drive share link to a direct download/view link
 * @param {string} url - The Google Drive share URL
 * @returns {string} - The direct link or the original URL if no ID found
 */
export const getGoogleDriveDirectLink = (url) => {
    if (!url) return '';

    // Check if it's already a direct link or not a Google Drive link
    if (!url.includes('google.com')) return url;

    // Extract ID from various Google Drive URL formats
    // Supports: drive.google.com/file/d/ID, open?id=ID, drive/folders/ID, googledrive.com/host/ID
    const regExp = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:file\/d\/|open\?id=|drive\/folders\/)|googledrive\.com\/host\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);

    if (match && match[1]) {
        const fileId = match[1];
        // Standard view/download link
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    return url;
};

/**
 * Optimized for Images: Uses the thumbnail endpoint which is often faster and less prone to 403s for simple embedding.
 * @param {string} url 
 * @returns {string} - The direct image link
 */
export const getGoogleDriveImageLink = (url) => {
    if (!url) return '';
    if (!url.includes('google.com')) return url;

    const regExp = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:file\/d\/|open\?id=|drive\/folders\/)|googledrive\.com\/host\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);

    if (match && match[1]) {
        const fileId = match[1];
        // 'sz=w1920' requests a width of 1920px (high quality). 
        // Note: This endpoint is unofficial but widely used and very stable for public files.
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
    }

    return url;
};

/**
 * Optimized for Video/Document Embedding: Uses the preview endpoint which is designed for iframes.
 * @param {string} url 
 * @returns {string} - The preview link suitable for src inside an iframe
 */
export const getGoogleDrivePreviewLink = (url) => {
    if (!url) return '';
    if (!url.includes('google.com')) return url;

    const regExp = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:file\/d\/|open\?id=|drive\/folders\/)|googledrive\.com\/host\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);

    if (match && match[1]) {
        const fileId = match[1];
        return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    return url;
};

/**
 * Specifically for videos, sometimes we might want a different approach 
 * but uc?export=view usually works for simple <video> tags too (if small)
 * or just as a preview link.
 */
export const getGoogleDriveVideoLink = (url) => {
    return getGoogleDriveDirectLink(url);
};
