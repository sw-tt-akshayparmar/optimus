import {
  type RouteConfig,
  route,
  index,
  layout,
  type RouteConfigEntry,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx", {}),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  layout("routes/_authenticated.tsx", [route("chat", "routes/chat.tsx")]),
] satisfies RouteConfig;
