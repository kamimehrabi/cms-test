"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@sglara/cn";

const titleVariants = cva("font-bold leading-tight tracking-tight", {
  variants: {
    variant: {
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      neutral: "text-neutral",
      base: "text-base-content",
    },
    size: {
      xs: "text-lg sm:text-xl",
      sm: "text-xl sm:text-2xl",
      md: "text-2xl sm:text-3xl",
      lg: "text-3xl sm:text-4xl",
      xl: "text-4xl sm:text-5xl",
      "2xl": "text-5xl sm:text-6xl",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: {
    variant: "base",
    size: "md",
    align: "center",
    weight: "bold",
  },
});

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  showDivider?: boolean;
  dividerColor?: "primary" | "secondary" | "accent" | "neutral" | "base-200";
}

export function Title({
  className,
  variant,
  size,
  align,
  weight,
  as = "h2",
  showDivider = false,
  dividerColor = "primary",
  children,
  ...props
}: TitleProps) {
  const Component = as;

  const dividerClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
    neutral: "bg-neutral",
    "base-200": "bg-base-200",
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Component
        className={cn(titleVariants({ variant, size, align, weight }))}
        {...props}
      >
        {children}
      </Component>

      {showDivider && (
        <div
          className={cn(
            "h-1 w-16 rounded-full",
            dividerClasses[dividerColor],
            align === "center" && "mx-auto",
            align === "right" && "ml-auto"
          )}
        />
      )}
    </div>
  );
}

// Convenience components for common use cases
export const SectionTitle = ({
  children,
  ...props
}: Omit<TitleProps, "as">) => (
  <Title as="h2" size="lg" variant="primary" {...props}>
    {children}
  </Title>
);

export const PageTitle = ({ children, ...props }: Omit<TitleProps, "as">) => (
  <Title as="h1" size="xl" variant="base" weight="extrabold" {...props}>
    {children}
  </Title>
);

export const CardTitle = ({ children, ...props }: Omit<TitleProps, "as">) => (
  <Title as="h3" size="md" variant="base" weight="semibold" {...props}>
    {children}
  </Title>
);
