import type { Route } from "./+types/product";
import styles from "../styles/products.module.css";
import { PRODUCTS } from "../data/products.data";

const PAYMENT_OPTIONS = [
  {
    name: "Credit Card",
    label: "Credit Card",
    link: "https://www.example.com/pay/credit-card",
    description: "Pay securely using your credit card.",
    icon: "💳"
  },
  {
    name: "PayPal",
    label: "PayPal",
    link: "https://www.paypal.com/checkout",
    description: "Checkout quickly with PayPal.",
    icon: "🅿️"
  },
  {
    name: "UPI",
    label: "UPI",
    link: "https://www.example.com/pay/upi",
    description: "Pay using any UPI app.",
    icon: "🏦"
  },
  {
    name: "Cash on Delivery",
    label: "Cash on Delivery",
    link: "https://www.example.com/pay/cod",
    description: "Pay with cash when your order arrives.",
    icon: "💵"
  }
];

export default function Product (props: Route.ComponentProps) {
  const product = PRODUCTS.find(
    (p) => String(p.productId) === String(props.loaderData.productId)
  );
  if (!product) return <div className={styles.productDetail}>Product not found</div>;
  return (
    <div className={styles.productDetail}>
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          maxWidth: 320,
          height: 200,
          objectFit: "contain",
          borderRadius: 10,
          background: "#f1f5f9",
          marginBottom: 20,
          border: "1px solid #e2e8f0"
        }}
      />
      <div className={styles.productName}>{product.name}</div>
      <div className={styles.productPrice}>{product.price}</div>
      <div className={styles.productDescription}>{product.description}</div>
      
      <div className={styles.productSection}>
        <div className={styles.sectionTitle}>Specifications</div>
        <ul className={styles.specList}>
          {product.specifications.map((spec) => (
            <li key={spec.name}>
              <span title={spec.description} style={{marginRight: 6}}>
                {spec.icon}
              </span>
              <strong>{spec.name}:</strong> {spec.value}
              <span style={{color: "#718096", marginLeft: 8, fontSize: "0.95em"}}>
                {spec.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className={styles.productSection}>
        <div className={styles.sectionTitle}>Other Info</div>
        <div className={styles.otherInfoBox}>{product.otherInfo}</div>
      </div>
      
      <div className={styles.productSection}>
        <div className={styles.sectionTitle}>Payment Options</div>
        <ul className={styles.paymentList}>
          {PAYMENT_OPTIONS.filter(opt => product.availablePayments.includes(opt.name)).map((option) => (
            <li key={option.name}>
              <a
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3182ce", textDecoration: "underline", display: "flex", alignItems: "center", gap: "0.5em" }}
                title={option.description}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ); 
}

export async function loader(req: any){
  return { productId: req.params.productId };
}