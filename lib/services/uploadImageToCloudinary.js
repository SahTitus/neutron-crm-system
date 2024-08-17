import { CLOUDINARY_URL } from "@lib/routes";
import { logger } from "@utils/helpers/log";

export const uploadImageToCloudinary = async ({ selectedImage }) => {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME
  const CLOUD_PRESET = process.env.NEXT_PUBLIC_CLOUD_PRESET

  try {

    if (selectedImage) {
      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", CLOUD_PRESET);
      data.append("cloud_name", CLOUD_NAME);
      data.append("folder", "neutron_images");

      const res = await fetch(CLOUDINARY_URL, {
        method: "post",
        body: data,
        mode: "cors",
      })

      const result = await res.json();

      return {
        image: result.secure_url,
        image_id: result.public_id
      }

    }
  } catch (error) {
    logger(error.message);
  }
}