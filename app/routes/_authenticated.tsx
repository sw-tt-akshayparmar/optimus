import { redirect, type ClientLoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useOutletContext } from "react-router";
import { getAuthorazation, getUserData } from "~/services/user.service";
import { User } from "~/models/User.model";

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const token = getAuthorazation();
  if (!token) {
    const params = new URLSearchParams();
    params.set("redirection", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  const user = getUserData();
  return { user: User.from(user) };
};

export default function AuthenticatedLayout() {
  const { user } = useLoaderData<typeof clientLoader>();

  return <Outlet context={{ user }} />;
}

export function useUser() {
  return useOutletContext<{ user: User }>();
}
