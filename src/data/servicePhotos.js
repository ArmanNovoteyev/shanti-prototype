// V3.0.8b — прямой маппинг service.id → фото.
// Файлы в public/assets/photos/ именуются по service.id (см. scripts/process_new_photos.py).

export function getServicePhoto(service) {
  return `/assets/photos/${service.id}.jpg`;
}
