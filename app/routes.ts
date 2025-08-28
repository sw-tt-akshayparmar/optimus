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
    index("routes/home.tsx", {}),
    route("chat", "routes/chat.tsx"),
    route("h6502", "components/H6502.tsx"),
    route("workspace", "routes/workspace.tsx"),
  ]),
] satisfies RouteConfig;
