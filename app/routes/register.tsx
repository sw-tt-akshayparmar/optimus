import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router-dom";
import { register } from "~/services/user.service";
import "~/styles/auth.css";
import { User } from "~/models/User.model";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!name || !username || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    await register(User.from({ name, username, password }));
    // Redirect to login page after successful registration
    return redirect("/login");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Registration failed" };
  }
};

export default function RegisterPage() {
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="auth">
      <h2 className="auth-title">Register</h2>
      <Form method="post" className="auth-form">
        <label htmlFor="name" className="auth-label">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="auth-input"
          required
          disabled={isSubmitting}
          autoFocus
        />

        <label htmlFor="username" className="auth-label">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="auth-input"
          required
          disabled={isSubmitting}
        />

        <label htmlFor="password" className="auth-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="auth-input"
          required
          minLength={6}
          disabled={isSubmitting}
        />

        {actionData?.error && <div className="auth-error">{actionData.error}</div>}

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </Form>
      <div className="auth-footer">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Login
        </Link>
      </div>
    </div>
  );
}
