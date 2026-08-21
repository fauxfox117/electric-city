import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("map", "routes/animals.tsx"),
  route("map/:id", "components/animal-data/animal.tsx"),
] satisfies RouteConfig;
