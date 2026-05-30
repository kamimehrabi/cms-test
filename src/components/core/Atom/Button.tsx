// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@sglara/cn";

const buttonVariants = cva(
    "inline-flex items-center cursor-pointer justify-center rounded-md font-medium transition-all duration-300 overflow-hidden text-sm sm:text-base disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-content hover:bg-primary/90 shadow-lg sm:shadow-xl hover:shadow-2xl hover:-translate-y-1 ",
                outline: "border bg-primary/5 border-primary/30 text-base-content hover:border-primary hover:text-base-content hover:bg-primary/10",
                ghost: "bg-transparent text-base-content hover:bg-base-200",
            },
            size: {
                xs: "h-6 px-2 py-2 text-xs",
                sm: "h-8 px-3 py-3 text-xs",
                md: "h-10 px-4 py-4 text-sm",
                lg: "h-12 px-6 py-6 text-lg",
                xl: "h-14 px-8 py-8 text-xl",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

export default function Button({ className, variant, size, ...props }: ButtonProps) {
    return (
        <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
}
