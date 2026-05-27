import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../middleware/error.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Delivery transformation baked into every stored URL so Cloudinary serves
// the best format/quality for each client automatically.
const DELIVERY = { fetch_format: 'auto', quality: 'auto' };

// Upload an in-memory file (multer memoryStorage) to Cloudinary. Returns
// { url, publicId } — url has auto format/quality, publicId is stored so the
// asset can be deleted later. Returns null when no file is given.
export async function uploadImage(file, folder) {
  if (!file) return null;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    stream.end(file.buffer);
  }).catch(() => {
    throw new AppError(502, 'อัปโหลดรูปไป Cloudinary ไม่สำเร็จ');
  });

  return {
    url: cloudinary.url(result.public_id, { secure: true, ...DELIVERY }),
    publicId: result.public_id,
  };
}

// Extract the Cloudinary public_id from a delivery URL we produced.
// Fallback only — used for images uploaded before publicId was stored.
// Returns null for empty values or non-Cloudinary URLs (e.g. legacy paths).
function publicIdFromUrl(url) {
  if (!url || !url.includes('/upload/')) return null;
  let rest = url.split('/upload/')[1];
  rest = rest.replace(/^[^/]*_[^/]*\//, ''); // drop transformation segment (e.g. f_auto,q_auto/)
  rest = rest.replace(/^v\d+\//, ''); // drop version segment (e.g. v123/)
  return rest.replace(/\.[^/.]+$/, ''); // drop file extension
}

// Best-effort removal of a Cloudinary image. Prefers the stored publicId and
// falls back to parsing the URL. Logs (never throws) so cleanup failures are
// visible without breaking the request that triggered them.
export async function deleteImage({ url, publicId } = {}) {
  const id = publicId || publicIdFromUrl(url);
  if (!id) return;
  try {
    const res = await cloudinary.uploader.destroy(id);
    if (res.result !== 'ok') console.warn(`Cloudinary destroy "${id}": ${res.result}`);
  } catch (err) {
    console.error(`Cloudinary destroy failed for "${id}":`, err.message);
  }
}
