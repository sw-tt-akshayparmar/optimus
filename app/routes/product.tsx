import type  { Route } from "./+types/product"

export default function Product (props: Route.ComponentProps) {
  return <>
    <div>Product: {props.loaderData.productId}</div>
  </> 
}

export async function loader(req: any){
  return { productId: req.params.productId };
}