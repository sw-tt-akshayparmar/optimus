import { type GalleryImage } from "../data/gallery.data";

type GalleryModalProps = {
  modal: GalleryImage | null;
  onClose: () => void;
};

export function GalleryModal({ modal, onClose }: GalleryModalProps) {
  if (!modal) return null;
  return (
    <div className="gallery-modal" onClick={onClose}>
      <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
        <img src={modal.src} alt={modal.alt} className="gallery-modal-img" />
        <div className="gallery-modal-meta">
          <div><b>{modal.alt}</b></div>
          {modal.author && <div>By: {modal.author}</div>}
          {modal.tags && (
            <div>
              Tags: {modal.tags.map(tag => (
                <span key={tag} className="gallery-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
        <button className="gallery-modal-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}