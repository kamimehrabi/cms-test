"use client";

import { useEffect } from "react";
import { useScriptInject, useScriptInjectAll, type InjectableScript } from "@/hooks/useScript";
import CustomElement from "./core/base/CustomElement";
import { registerRouteElement } from "@/app/route-element-registry";

export const webComponentTag = "cars-container";

interface CarsProps {
  scripts: InjectableScript[];
  container: string;
  containerTag?: string;
}

const CarsComponent = ({ scripts, container, containerTag }: CarsProps) => {
  const tag = containerTag ?? webComponentTag;
  useEffect(() => { registerRouteElement("/cars", tag); }, [tag]);
  useScriptInjectAll(scripts);
  useScriptInject(container);
  return <CustomElement element={tag} />;
};

export default CarsComponent;
