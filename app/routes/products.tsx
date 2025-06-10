import { PRODUCTS } from "../data/products.data";
import styles from "../styles/products.module.css";

export default function Products() {
  return (
    <div className={styles.productList}>
      <div className={styles.productListTitle}>Product List</div>
      <div className={styles.productGrid}>
        {PRODUCTS.map((prod) => (
          <div key={prod.productId} className={styles.productCard}>
            <img
              src={prod.image}
              alt={prod.name}
              className={styles.productCardImage}
              loading="lazy"
            />
            <div className={styles.productCardTitle}>{prod.name}</div>
            <div className={styles.productCardPrice}>{prod.price}</div>
            <div className={styles.productCardDesc}>
              {prod.shortDescription || prod.description}
            </div>
            <a
              href={`/product/${prod.productId}`}
              className={styles.productCardLink}
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
