import axios from "axios";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "course_uploads"); // 👈 cloudinary preset
  formData.append("cloud_name", "dmehqtqpv");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dmehqtqpv/image/upload",
  
    formData
  );

  return res.data.secure_url;
};
