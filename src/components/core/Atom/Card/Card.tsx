"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@sglara/cn";

const cardVariants = cva(
    "rounded-box transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
    {
        variants: {
            variant: {
                default: "bg-background border border-primary/20 shadow-sm",
                outlined: "bg-background border-2 border-primary/20 shadow-none",
                elevated: "bg-background border border-primary/20 shadow-lg hover:shadow-xl",
                interactive: "bg-background border border-primary/20 shadow-sm hover:shadow-md hover:border-primary/20 cursor-pointer hover:-translate-y-1",
                ghost: "bg-transparent border border-transparent shadow-none",
                primary: "bg-primary/5 border border-primary/20 shadow-sm",
                secondary: "bg-secondary/5 border border-secondary/20 shadow-sm",
                accent: "bg-accent/5 border border-accent/20 shadow-sm",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const cardHeaderVariants = cva(
    "flex flex-col space-y-1.5",
    {
        variants: {
            align: {
                left: "text-left",
                center: "text-center",
                right: "text-right",
            },
            spacing: {
                none: "pb-0",
                tight: "pb-2",
                normal: "pb-4",
                relaxed: "pb-6",
            },
        },
        defaultVariants: {
            align: "left",
            spacing: "normal",
        },
    }
);

const cardContentVariants = cva(
    "text-base-content",
    {
        variants: {
            spacing: {
                none: "pt-0",
                tight: "pt-2",
                normal: "pt-4",
                relaxed: "pt-6",
            },
        },
        defaultVariants: {
            spacing: "normal",
        },
    }
);

const cardFooterVariants = cva(
    "flex items-center",
    {
        variants: {
            align: {
                left: "justify-start",
                center: "justify-center",
                right: "justify-end",
                between: "justify-between",
            },
            spacing: {
                none: "pt-0",
                tight: "pt-2",
                normal: "pt-4",
                relaxed: "pt-6",
            },
        },
        defaultVariants: {
            align: "left",
            spacing: "normal",
        },
    }
);

// Main Card Interface
export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    asChild?: boolean;
}

// Card Header Interface
export interface CardHeaderProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> { }

// Card Content Interface
export interface CardContentProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> { }

// Card Footer Interface
export interface CardFooterProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> { }

// Card Title Interface
export interface CardTitleProps
    extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

// Card Description Interface
export interface CardDescriptionProps
    extends React.HTMLAttributes<HTMLParagraphElement> { }

// Main Card Component
const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
        const Comp = asChild ? React.Fragment : "div";

        if (asChild) {
            return (
                <div
                    className={cn(cardVariants({ variant }), className)}
                    ref={ref}
                    {...props}
                />
            );
        }

        return (
            <div
                className={cn(cardVariants({ variant }), className)}
                ref={ref}
                {...props}
            />
        );
    }
);

Card.displayName = "Card";

// Card Header Component
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, align, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardHeaderVariants({ align }), className)}
            {...props}
        />
    )
);

CardHeader.displayName = "CardHeader";

// Card Content Component
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardContentVariants({}), className)}
            {...props}
        />
    )
);

CardContent.displayName = "CardContent";

// Card Footer Component
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, align, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardFooterVariants({ align }), className)}
            {...props}
        />
    )
);

CardFooter.displayName = "CardFooter";

// Card Title Component
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, as = "h3", ...props }, ref) => {
        const Component = as;
        return (
            <Component
                ref={ref}
                className={cn(
                    "text-lg font-semibold leading-none tracking-tight text-base-content",
                    className
                )}
                {...props}
            />
        );
    }
);

CardTitle.displayName = "CardTitle";

// Card Description Component
const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("text-sm text-base-content/70", className)}
            {...props}
        />
    )
);

CardDescription.displayName = "CardDescription";

// Convenience Components for Common Use Cases
export const ProductCard = forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
    ({ children, className, ...props }, ref) => (
        <Card
            ref={ref}
            variant="interactive"
            className={cn("group overflow-hidden", className)}
            {...props}
        >
            {children}
        </Card>
    )
);

ProductCard.displayName = "ProductCard";

export const InfoCard = forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
    ({ children, className, ...props }, ref) => (
        <Card
            ref={ref}
            variant="primary"
            className={cn("border-l-4 border-l-primary", className)}
            {...props}
        >
            {children}
        </Card>
    )
);

InfoCard.displayName = "InfoCard";

export const WarningCard = forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
    ({ children, className, ...props }, ref) => (
        <Card
            ref={ref}
            variant="outlined"
            className={cn("border-l-4 border-l-warning bg-warning/5", className)}
            {...props}
        >
            {children}
        </Card>
    )
);

WarningCard.displayName = "WarningCard";

export const ErrorCard = forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
    ({ children, className, ...props }, ref) => (
        <Card
            ref={ref}
            variant="outlined"
            className={cn("border-l-4 border-l-error bg-error/5", className)}
            {...props}
        >
            {children}
        </Card>
    )
);

ErrorCard.displayName = "ErrorCard";

export const SuccessCard = forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
    ({ children, className, ...props }, ref) => (
        <Card
            ref={ref}
            variant="outlined"
            className={cn("border-l-4 border-l-success bg-success/5", className)}
            {...props}
        >
            {children}
        </Card>
    )
);

SuccessCard.displayName = "SuccessCard";

// Export all components
export {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
    CardDescription,
};

// Default export
export default Card;