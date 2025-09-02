import { Link, useSearchParams } from "react-router-dom";
import { login } from "~/services/user.service";

import { useState } from "react";
import type { User } from "~/models/User.model";
import { useNavigate, useParams } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
      setError("Email and password are required.");
      setSubmitting(false);
      return;
    }
    try {
      const user: User = await login({
        username: username.toString(),
        password: password.toString(),
      });
      navigate(searchParams.get("redirection")!);
    } catch (err: any) {
      setError(err.error || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-8">
      <div className="bg-card p-10 rounded-xl shadow-nav w-full max-w-[400px] text-center">
        <h1 className="mb-6 text-primary text-xl font-bold">Login</h1>
        {error && <div className="text-error bg-red-900 border border-error p-3 rounded mb-6 text-left">{error}</div>}
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 font-medium text-chatMsg">Username</label>
            <input id="username" type="text" name="username" required className="w-full p-3 border border-chatInputBorder rounded bg-chatInput text-chatMsg text-base outline-none transition-colors focus:border-primary" />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 font-medium text-chatMsg">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full p-3 border border-chatInputBorder rounded bg-chatInput text-chatMsg text-base outline-none transition-colors focus:border-primary"
            />
          </div>
          <button type="submit" className="w-full p-3 rounded bg-accent text-white text-base font-semibold transition-colors hover:bg-primary hover:text-cardDark disabled:bg-bg-muted disabled:text-chatBtnDisabledText disabled:cursor-not-allowed" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-sm text-indigo-300">
          Don&apos;t have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
