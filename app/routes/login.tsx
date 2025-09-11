import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { login } from "~/services/user.service";
import { Button } from "primereact/button";

import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import LoaderActions from "~/enums/loader.enum";
import { enable, disable } from "~/services/loader.service";
import type { AuthToken } from "~/models/Auth.model";
import type { Exception } from "~/exception/app.exception";

export default function LoginPage() {
  const navigate = useNavigate();
  const loaders = useSelector<{ loaders: any }, any>(state => state.loaders.loaders);
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    enable(LoaderActions.LOG_IN);
    login(userData)
      .then((token: AuthToken) => {
        navigate(searchParams.get("redirection")!);
      })
      .catch((err: Exception) => {})
      .finally(() => {
        disable(LoaderActions.LOG_IN);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-8">
      <div className="bg-card p-10 rounded-xl shadow-nav w-full max-w-[400px] text-center">
        <h1 className="mb-6 text-primary text-xl font-bold">Login</h1>

        <form className="text-left">
          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 font-medium text-chatMsg">
              Username
            </label>
            <InputText
              id="username"
              type="text"
              name="username"
              value={userData.username}
              required
              className="w-full"
              onChange={e => {
                setUserData({ ...userData, username: e.target.value });
              }}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 font-medium text-chatMsg">
              Password
            </label>
            <InputText
              id="password"
              type="password"
              name="password"
              value={userData.password}
              onChange={e => {
                setUserData({ ...userData, password: e.target.value });
              }}
              required
              autoComplete="current-password"
              className="w-full"
            />
          </div>
          <Button
            loading={loaders[LoaderActions.LOG_IN]}
            icon="pi pi-user"
            onClick={handleSubmit}
            label="Log in"
          />
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
