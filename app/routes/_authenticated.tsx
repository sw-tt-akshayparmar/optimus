import {
  redirect,
  type ClientLoaderFunctionArgs,
  Outlet,
  useLoaderData,
  useOutletContext,
  type LoaderFunctionArgs,
} from "react-router";
import { getAuthorazation, getUserData } from "~/services/user.service";
import { User } from "~/models/User.model";

const isBrowser: boolean = typeof window !== "undefined";

function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map(c => {
      const [k, ...v] = c.split("=");
      return [k?.trim(), decodeURIComponent(v.join("="))];
    })
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) {
    const cookieHeader = request.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies["auth_token"]; // name you set via Set-Cookie on login

    if (!token) {
      const params = new URLSearchParams([["redirection", new URL(request.url).pathname]]);
      return redirect("/login?" + params.toString());
    }
    return token;
  }

  const token = getAuthorazation();
  if (!token) {
    const params = new URLSearchParams();
    params.set("redirection", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  const user = getUserData(); // small synchronous shape from local cache
  return { user: User.from(user) };
};

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  if (isBrowser) {
    const token = getAuthorazation();
    if (!token) {
      const params = new URLSearchParams();
      params.set("redirection", new URL(request.url).pathname);
      return redirect("/login?" + params.toString());
    }
    const user = getUserData();
    return { user: User.from(user) };
  }
  return { user: null };
};

export default function AuthenticatedLayout() {
  const { user } = useLoaderData<typeof clientLoader>();

  return <Outlet context={{ user }} />;
}

export function useUser() {
  return useOutletContext<{ user: User }>();
}
