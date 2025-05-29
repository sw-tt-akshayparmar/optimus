import type { Route } from "./+types/products";

export default function Products(props: Route.ComponentProps) {
  console.log(props)
  return (
    <>
      <div>Product List</div>
      <ul>{props.loaderData.data.map((prod,index)=><li key={index}><a href={'product/' + prod.productId}>{prod.productId}</a></li>)}</ul>
    </>
  );
}

export async function loader():Promise<{ data: {productId: number}[]}>{
  return { data: [{ productId: 1233 }, { productId: 12586 }] };
}
