export type GalleryImage = {
  src: string;
  alt: string;
  author?: string;
  tags?: string[];
};

export const IMAGES: GalleryImage[] = [
  { src: "https://picsum.photos/id/1015/400/300", alt: "Mountain Lake", author: "John Doe", tags: ["nature", "lake"] },
  { src: "https://picsum.photos/id/1025/400/300", alt: "Dog Portrait", author: "Jane Smith", tags: ["dog", "animal"] },
  { src: "https://placekitten.com/400/300", alt: "Cute Kitten", author: "Cat Lover", tags: ["cat", "kitten"] },
  { src: "https://picsum.photos/id/1041/400/300", alt: "Forest Path", author: "Wanderer", tags: ["forest", "path"] },
  { src: "https://placekitten.com/401/300", alt: "Kitten Closeup", author: "Cat Lover", tags: ["cat", "closeup"] },
  { src: "https://picsum.photos/id/1050/400/300", alt: "Desert Road", author: "Traveler", tags: ["desert", "road"] },
];