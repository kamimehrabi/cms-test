import { webComponentTag as homeTag } from "../components/HomeComponent";
import { webComponentTag as carsTag } from "../components/CarsComponent";
import { webComponentTag as carsDetailTag } from "../components/CarsDetailComponent";

export const routeMap: Record<string, string> = {
  "/": homeTag,
  "/cars": carsTag,
};

// Ordered list of prefix → tag pairs for dynamic segments (e.g. /cars/:slug).
// Evaluated top-to-bottom; first match wins.
export const routePrefixMap: Array<[string, string]> = [
  ["/cars/", carsDetailTag],
];