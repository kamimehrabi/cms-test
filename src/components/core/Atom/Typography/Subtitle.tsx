"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@sglara/cn";

const subtitleVariants = cva("font-medium leading-relaxed", {
  variants: {
    variant: {
      primary: "text-primary/80",
      secondary: "text-secondary/80",
      accent: "text-accent/80",
      neutral: "text-neutral/80",
      base: "text-base-content/70",
    },
    size: {
      xs: "text-sm sm:text-base",
      sm: "text-base sm:text-lg",
      md: "text-lg sm:text-xl",
      lg: "text-xl sm:text-2xl",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "base",
    size: "sm",
    align: "center",
  },
});

export interface SubtitleProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof subtitleVariants> {
  as?: "p" | "span" | "div";
}

export function Subtitle({
  className,
  variant,
  size,
  align,
  as = "p",
  children,
  ...props
}: SubtitleProps) {
  const Component = as;

  return (
    <Component
      className={cn(subtitleVariants({ variant, size, align }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Subtitle;
