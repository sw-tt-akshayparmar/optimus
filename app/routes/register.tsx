import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router-dom";
import { register } from "~/services/user.service";
import { User } from "~/models/User.model";

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const formData = await request.formData();
//   const name = formData.get("name") as string;
//   const username = formData.get("username") as string;
//   const password = formData.get("password") as string;

//   if (!name || !username || !password) {
//     return { error: "All fields are required." };
//   }

//   if (password.length < 6) {
//     return { error: "Password must be at least 6 characters long." };
//   }

//   try {
//     await register(User.from({ name, username, password }));
//     // Redirect to login page after successful registration
//     return redirect("/login");
//   } catch (error) {
//     return { error: error instanceof Error ? error.message : "Registration failed" };
//   }
// };

export default function RegisterPage() {
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-8">
      <div className="bg-card p-10 rounded-xl shadow-nav w-full max-w-[400px] text-center">
        <h2 className="mb-6 text-primary text-xl font-bold">Register</h2>
        <Form method="post" className="text-left">
          <label htmlFor="name" className="block mb-2 font-medium text-chatMsg">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={isSubmitting}
            autoFocus
            className="w-full p-3 border border-chatInputBorder rounded bg-chatInput text-chatMsg text-base outline-none transition-colors focus:border-primary mb-5"
          />

          <label htmlFor="username" className="block mb-2 font-medium text-chatMsg">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-chatInputBorder rounded bg-chatInput text-chatMsg text-base outline-none transition-colors focus:border-primary mb-5"
          />

          <label htmlFor="password" className="block mb-2 font-medium text-chatMsg">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            disabled={isSubmitting}
            className="w-full p-3 border border-chatInputBorder rounded bg-chatInput text-chatMsg text-base outline-none transition-colors focus:border-primary mb-5"
          />

          {actionData?.error && <div className="text-error bg-red-900 border border-error p-3 rounded mb-6 text-left">{actionData.error}</div>}

          <button type="submit" className="w-full p-3 rounded bg-accent text-white text-base font-semibold transition-colors hover:bg-primary hover:text-cardDark disabled:bg-bg-muted disabled:text-chatBtnDisabledText disabled:cursor-not-allowed" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </Form>
        <div className="mt-6 text-sm text-indigo-300">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}
