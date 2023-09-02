const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storageImages = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "project3-ironhack",
    allowed_formats: async (req, file) => "jpg,png,pdf",
  },
});

const storageFiles = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "docs_and_files",
    allowed_formats: async (req, file) => "pdf",
    resource_type: "raw", // Set resource_type to "raw" for non-image files
    access_mode: "public",
  },
});

const uploadImages = multer({ storage: storageImages });
const uploadFiles = multer({ storage: storageFiles });

module.exports = {
  uploadFiles,
  uploadImages,
};
