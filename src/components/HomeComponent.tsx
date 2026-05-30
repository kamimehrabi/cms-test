"use client";

import { useEffect } from "react";
import { useScriptInject, useScriptInjectAll, type InjectableScript } from "@/hooks/useScript";
import CustomElement from "./core/base/CustomElement";
import { registerRouteElement } from "@/app/route-element-registry";

export const webComponentTag = "home-container";

interface HomeProps {
  scripts: InjectableScript[];
  container: string;
  containerTag?: string;
}

const HomeComponent = ({ scripts, container, containerTag }: HomeProps) => {
  const tag = containerTag ?? webComponentTag;
  useEffect(() => { registerRouteElement("/", tag); }, [tag]);
  useScriptInjectAll(scripts);
  useScriptInject(container);
  return <CustomElement element={tag} />;
};

export default HomeComponent;
