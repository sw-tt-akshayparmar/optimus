import { Link, useSearchParams } from "react-router-dom";
import { login } from "~/services/user.service";
import "./login.css";
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
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" type="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="auth-link">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
