import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { login } from "~/services/user.service";
import { Button } from "primereact/button";

import type { User } from "~/models/User.model";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const user: User = await login(userData);
    navigate(searchParams.get("redirection")!);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-8">
      <div className="bg-card p-10 rounded-xl shadow-nav w-full max-w-[400px] text-center">
        <h1 className="mb-6 text-primary text-xl font-bold">Login</h1>

        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 font-medium text-chatMsg">
              Username
            </label>
            <InputText
              id="username"
              type="text"
              name="username"
              required
              className="w-full p-3 border border-chatInputBorder rounded bg-chatInput text-chatMsg text-base outline-none transition-colors focus:border-primary"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 font-medium text-chatMsg">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full p-3 border border-chatInputBorder rounded bg-chatInput text-chatMsg text-base outline-none transition-colors focus:border-primary"
            />
          </div>
          <Button icon="pi pi-user" label="Log in" />
        </form>
        <p className="mt-6 text-sm text-indigo-300">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
