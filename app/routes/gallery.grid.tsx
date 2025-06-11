import { type GalleryImage } from "./gallery.data";

type GalleryGridProps = {
  images: GalleryImage[];
  onImageClick: (img: GalleryImage) => void;
};

export function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  return (
    <div className="gallery-grid">
      {images.map((img, idx) => (
        <div key={idx} className="gallery-item" onClick={() => onImageClick(img)}>
          <img src={img.src} alt={img.alt} className="gallery-img" />
          <div className="gallery-meta">
            <span className="gallery-author">{img.author}</span>
            {img.tags && (
              <span className="gallery-tags">
                {img.tags.map(tag => (
                  <span key={tag} className="gallery-tag">{tag}</span>
                ))}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}