import { useGallery } from "./gallery.hook";
import { GalleryModal } from "./gallery.modal";
import { GalleryGrid } from "./gallery.grid";
import "./gallery.css";

export default function Gallery() {
  const { modal, setModal, images } = useGallery();

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Gallery</h2>
      <GalleryGrid images={images} onImageClick={setModal} />
      <GalleryModal modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}