import styles from "../styles/products.module.css";

const SERVICES = [
  { id: 1, name: "Photo Editing", price: "$99", description: "Professional photo retouching and editing." },
  { id: 2, name: "Studio Rental", price: "$199/day", description: "Rent our fully equipped photo studio." },
  { id: 3, name: "Product Photography", price: "$299", description: "High-quality product photography for your business." },
];

export default function Services() {
  return (
    <div className={styles.productList}>
      <div className={styles.productListTitle}>Our Services</div>
      <ul>
        {SERVICES.map((service) => (
          <li key={service.id} className={styles.productItem}>
            <div className={styles.productName}>{service.name}</div>
            <div className={styles.productPrice}>{service.price}</div>
            <div className={styles.productDescription}>{service.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}