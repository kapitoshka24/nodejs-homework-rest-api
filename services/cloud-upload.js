const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadCloud = promisify(cloudinary.uploader.upload);

class UploadService {
  async saveAvatar(pathFile, oldIdCloudAvatar) {
    const { public_id: idCloudAvatar, secure_url: avatarUrl } =
      await uploadCloud(pathFile, {
        public_id: oldIdCloudAvatar?.replace("Avatar/", ""), // 'CloudAvatar/public_id'
        folder: "Avatar",
        transformation: { width: 250, height: 250, crop: "pad" },
      });
    return { idCloudAvatar, avatarUrl };
  }
}

module.exports = UploadService;
