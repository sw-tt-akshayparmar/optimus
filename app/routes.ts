import {
  type RouteConfig,
  route,
  index,
  layout,
  type RouteConfigEntry,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  layout("routes/_authenticated.tsx", [
    route("chat", "routes/chat.tsx"),
    index("routes/home.tsx", {}),
  ]),
] satisfies RouteConfig;
