import { useState } from "react";
import "./gallery.css";

// Using SFW random image APIs (e.g., picsum.photos and placekitten.com)
const IMAGES = [
  { src: "https://picsum.photos/id/1015/400/300", alt: "Mountain Lake" },
  { src: "https://picsum.photos/id/1025/400/300", alt: "Dog Portrait" },
  { src: "https://placekitten.com/400/300", alt: "Cute Kitten" },
  { src: "https://picsum.photos/id/1041/400/300", alt: "Forest Path" },
  { src: "https://placekitten.com/401/300", alt: "Kitten Closeup" },
  { src: "https://picsum.photos/id/1050/400/300", alt: "Desert Road" },
];

export default function Gallery() {
  const [modal, setModal] = useState<{src: string, alt: string} | null>(null);

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Gallery</h2>
      <div className="gallery-grid">
        {IMAGES.map((img, idx) => (
          <div key={idx} className="gallery-item" onClick={() => setModal(img)}>
            <img src={img.src} alt={img.alt} className="gallery-img" />
          </div>
        ))}
      </div>
      {modal && (
        <div className="gallery-modal" onClick={() => setModal(null)}>
          <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
            <img src={modal.src} alt={modal.alt} className="gallery-modal-img" />
            <button className="gallery-modal-close" onClick={() => setModal(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}