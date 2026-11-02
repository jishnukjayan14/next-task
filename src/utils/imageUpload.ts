/**
 * Utility to process and optimize image files uploaded from the user's device.
 * Automatically resizes and compresses images to maintain fast page load speeds
 * and prevent storage quota issues while keeping high visual fidelity.
 */

export const compressAndReadFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith("image/")) {
      return reject(new Error("Selected file is not an image"));
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);

    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        return reject(new Error("Failed to read file"));
      }

      // If SVG or GIF, preserve raw data URL to keep vector quality or animation
      if (file.type === "image/svg+xml" || file.type === "image/gif") {
        return resolve(rawDataUrl);
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback to raw data url if image decode fails
        resolve(rawDataUrl);
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down proportionally if larger than maximum limits
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            return resolve(rawDataUrl);
          }

          // Fill white background in case of transparent background
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Export as optimized JPEG
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(optimizedDataUrl);
        } catch {
          // In case canvas has any issue, fallback to rawDataUrl
          resolve(rawDataUrl);
        }
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Process multiple files from an input event or drag-and-drop
 */
export const processImageFiles = async (
  files: FileList | File[]
): Promise<string[]> => {
  const fileArray = Array.from(files).filter((file) =>
    file.type.startsWith("image/")
  );

  if (fileArray.length === 0) return [];

  const results = await Promise.all(
    fileArray.map((file) => compressAndReadFile(file))
  );

  return results;
};
