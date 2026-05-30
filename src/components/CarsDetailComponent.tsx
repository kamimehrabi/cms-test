"use client";

import { useScriptInject, useScriptInjectAll, type InjectableScript } from "@/hooks/useScript";
import CustomElement from "./core/base/CustomElement";

export const webComponentTag = "inventory-detail-component";

interface CarsDetailProps {
  scripts: string;
}

const CarsDetailComponent = ({ scripts }: CarsDetailProps) => {
  useScriptInject(scripts);
  return <CustomElement element={webComponentTag} />;
};

export default CarsDetailComponent;
