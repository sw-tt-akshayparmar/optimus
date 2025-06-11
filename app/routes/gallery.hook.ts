import { useState } from "react";
import { IMAGES, type GalleryImage } from "../data/gallery.data";

export function useGallery() {
  const [modal, setModal] = useState<GalleryImage | null>(null);
  const [images] = useState<typeof IMAGES>(IMAGES); // For future extensibility (e.g., filtering)
  return { modal, setModal, images };
}