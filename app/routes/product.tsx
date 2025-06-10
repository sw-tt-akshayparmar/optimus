import type { Route } from "./+types/product";
import styles from "../styles/products.module.css";

const PRODUCTS = [
  { productId: 1233, name: "Camera", price: "$299", description: "A high-quality digital camera." },
  { productId: 12586, name: "Tripod", price: "$49", description: "A sturdy tripod for cameras." },
];

export default function Product (props: Route.ComponentProps) {
  const product = PRODUCTS.find(
    (p) => String(p.productId) === String(props.loaderData.productId)
  );
  if (!product) return <div className={styles.productDetail}>Product not found</div>;
  return (
    <div className={styles.productDetail}>
      <div className={styles.productName}>{product.name}</div>
      <div className={styles.productPrice}>{product.price}</div>
      <div className={styles.productDescription}>{product.description}</div>
    </div>
  ); 
}

export async function loader(req: any){
  return { productId: req.params.productId };
}