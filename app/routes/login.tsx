import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router-dom";
import { login } from "~/services/user.service";
import "./login.css";
import { useState } from "react";

export default function LoginPage() {
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();

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
      const res = await login({ username: username.toString(), password: password.toString() });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        {actionData?.error && <div className="error-message">{actionData.error}</div>}
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
          Don&apost have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
