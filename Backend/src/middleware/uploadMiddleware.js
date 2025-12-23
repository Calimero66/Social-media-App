import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const allowedVideoTypes = /mp4|mov|avi|mkv|webm/;
    const allowedMimeTypes = /image\/(jpeg|jpg|png|gif)|video\/(mp4|quicktime|x-msvideo|x-matroska|webm)/;

    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    const isValidExt = allowedImageTypes.test(ext) || allowedVideoTypes.test(ext);
    const isValidMime = allowedMimeTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, MP4, MOV, AVI, MKV, and WEBM are allowed.'));
    }
};

export const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
    fileFilter,
});
