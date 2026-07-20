import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reportes', // Nombre de la carpeta en tu cuenta de Cloudinary
    format: async (req, file) => 'png', 
    public_id: (req, file) => Date.now().toString(),
  },
});

export const parser = multer({ storage: storage });