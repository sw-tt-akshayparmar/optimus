import type { Route } from "./+types/products";
import styles from "../styles/products.module.css";

const PRODUCTS = [
  { productId: 1233, name: "Camera", price: "$299" },
  { productId: 12586, name: "Tripod", price: "$49" },
];

export default function Products(props: Route.ComponentProps) {
  return (
    <div className={styles.productList}>
      <div className={styles.productListTitle}>Product List</div>
      <ul>
        {PRODUCTS.map((prod) => (
          <li key={prod.productId} className={styles.productItem}>
            <a href={'product/' + prod.productId}>
              {prod.name} - {prod.price}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function loader() {
  return { data: PRODUCTS };
}
