// Downscale an image File on the client before upload so large photos fit the
// server limit and stored files stay small. Falls back to the original file on
// any unsupported type or failure.
const SKIP_TYPES = ['image/svg+xml', 'image/gif'];

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function resizeImage(file, { maxDim = 1600, quality = 0.85 } = {}) {
  if (!file || !file.type?.startsWith('image/') || SKIP_TYPES.includes(file.type)) return file;
  try {
    const img = await loadImage(await readAsDataURL(file));
    const longest = Math.max(img.width, img.height);
    const scale = Math.min(1, maxDim / longest);

    // Already small enough -> keep the original (avoid needless re-encode).
    if (scale === 1 && file.size <= 1_500_000) return file;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob) return file;

    const name = `${file.name.replace(/\.\w+$/, '')}.jpg`;
    return new File([blob], name, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}
