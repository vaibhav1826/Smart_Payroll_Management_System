const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary using env variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store uploaded files directly to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'shiv_enterprises/employees',
        allowed_formats: ['jpg', 'jpeg', 'png', 'svg'],
        transformation: [{ width: 800, crop: 'limit', quality: 'auto' }],
        public_id: `${Date.now()}-${file.fieldname}`,
    }),
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|svg/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images (jpeg, jpg, png, svg) are allowed!'));
};

const uploadMiddleware = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
});

module.exports = uploadMiddleware;
