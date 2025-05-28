import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route('about', 'routes/about.tsx'),
  route('services', 'routes/services.tsx'),
  route('dashboard', 'routes/dashboard.tsx', [
    route('','routes/dashboard-home.tsx'),
    route('map','routes/map.tsx'),
    route('monitor','routes/monitor.tsx'),
    route('weather','routes/weather.tsx'),
  ]),
] satisfies RouteConfig;


