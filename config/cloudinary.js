const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

const getCloudOptions = (userId = Date.now()) => {
  const options = {
    public_id: `${userId}_${Date.now()}`,
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };

  return options;
};

module.exports = { cloudinary, getCloudOptions };
