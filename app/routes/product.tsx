import type  { Route } from "./+types/product"

export default function Product (props: Route.ComponentProps) {
  console.log(props)
  return <>
    <div>Product: {props.loaderData.productId}</div>
  </> 
}

export async function loader(req: any){
  console.log(req)
  return { productId: req.params.productId };
}