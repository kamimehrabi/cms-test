"use client";

import React, { forwardRef, useEffect, useCallback } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@sglara/cn";
import { createPortal } from "react-dom";

// Modal Overlay Variants
const modalOverlayVariants = cva(
    "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
    {
        variants: {
            backdrop: {
                blur: "bg-black/50 backdrop-blur-sm",
                solid: "bg-black/70",
                light: "bg-black/30",
                dark: "bg-black/80",
                transparent: "bg-transparent",
            },
        },
        defaultVariants: {
            backdrop: "blur",
        },
    }
);

// Modal Container Variants
const modalVariants = cva(
    "relative bg-background rounded-box shadow-2xl transition-all duration-300 overflow-hidden max-h-[90vh] flex flex-col",
    {
        variants: {
            size: {
                sm: "max-w-sm w-full",
                md: "max-w-md w-full",
                lg: "max-w-lg w-full",
                xl: "max-w-xl w-full",
                "2xl": "max-w-2xl w-full",
                "3xl": "max-w-3xl w-full",
                "4xl": "max-w-4xl w-full",
                full: "max-w-full w-[95vw]",
            },
            animation: {
                scale: "animate-in zoom-in-95 fade-in",
                slide: "animate-in slide-in-from-bottom-4 fade-in",
                fade: "animate-in fade-in",
                bounce: "animate-in zoom-in-90 fade-in",
            },
        },
        defaultVariants: {
            size: "md",
            animation: "scale",
        },
    }
);

// Modal Header Variants
const modalHeaderVariants = cva(
    "flex items-center justify-between p-6 border-b border-primary/20",
    {
        variants: {
            variant: {
                default: "bg-background",
                primary: "bg-primary/5 border-primary/20",
                secondary: "bg-secondary/5 border-secondary/20",
                accent: "bg-accent/5 border-accent/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

// Modal Content Variants
const modalContentVariants = cva("flex-1 p-6 overflow-y-auto", {
    variants: {
        spacing: {
            none: "p-0",
            tight: "p-3",
            normal: "p-6",
            relaxed: "p-8",
        },
    },
    defaultVariants: {
        spacing: "normal",
    },
});

// Modal Footer Variants
const modalFooterVariants = cva(
    "flex items-center p-6 border-t border-primary/20",
    {
        variants: {
            align: {
                left: "justify-start",
                center: "justify-center",
                right: "justify-end",
                between: "justify-between",
            },
        },
        defaultVariants: {
            align: "right",
        },
    }
);

// Main Modal Interface
export interface ModalProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClose">,
    VariantProps<typeof modalVariants>,
    VariantProps<typeof modalOverlayVariants> {
    open: boolean;
    onClose: () => void;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    preventScroll?: boolean;
    portal?: boolean;
    portalContainer?: HTMLElement;
}

// Modal Header Interface
export interface ModalHeaderProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalHeaderVariants> { }

// Modal Content Interface
export interface ModalContentProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalContentVariants> { }

// Modal Footer Interface
export interface ModalFooterProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalFooterVariants> { }

// Modal Title Interface
export interface ModalTitleProps
    extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

// Modal Description Interface
export interface ModalDescriptionProps
    extends React.HTMLAttributes<HTMLParagraphElement> { }

// Main Modal Component
const Modal = forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            open,
            onClose,
            closeOnBackdrop = true,
            closeOnEscape = true,
            showCloseButton = true,
            preventScroll = true,
            portal = true,
            portalContainer,
            size,
            animation,
            backdrop,
            className,
            children,
            ...props
        },
        ref
    ) => {
        // Handle ESC key press
        const handleEscape = useCallback(
            (e: KeyboardEvent) => {
                if (closeOnEscape && e.key === "Escape" && open) {
                    onClose();
                }
            },
            [closeOnEscape, open, onClose]
        );

        // Handle backdrop click
        const handleBackdropClick = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (closeOnBackdrop && e.target === e.currentTarget) {
                    onClose();
                }
            },
            [closeOnBackdrop, onClose]
        );

        // Prevent body scroll when modal is open
        useEffect(() => {
            if (open && preventScroll) {
                const originalStyle = window.getComputedStyle(document.body).overflow;
                document.body.style.overflow = "hidden";
                return () => {
                    document.body.style.overflow = originalStyle;
                };
            }
        }, [open, preventScroll]);

        // Add ESC key listener
        useEffect(() => {
            if (open) {
                document.addEventListener("keydown", handleEscape);
                return () => {
                    document.removeEventListener("keydown", handleEscape);
                };
            }
        }, [open, handleEscape]);

        // Don't render if closed
        if (!open) return null;

        const modalContent = (
            <div
                className={cn(modalOverlayVariants({ backdrop }))}
                onClick={handleBackdropClick}
                role="dialog"
                aria-modal="true"
            >
                <div
                    ref={ref}
                    className={cn(modalVariants({ size, animation }), className)}
                    {...props}
                >
                    {/* Close Button */}
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 text-base-content/50 hover:text-base-content transition-colors rounded-full p-2 hover:bg-base-200"
                            aria-label="Close modal"
                            type="button"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                    {children}
                </div>
            </div>
        );

        // Render with portal if enabled
        if (portal && typeof window !== "undefined") {
            const container = portalContainer || document.body;
            return createPortal(modalContent, container);
        }

        return modalContent;
    }
);

Modal.displayName = "Modal";

// Modal Header Component
const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
    ({ className, variant, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(modalHeaderVariants({ variant }), className)}
            {...props}
        />
    )
);

ModalHeader.displayName = "ModalHeader";

// Modal Content Component
const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
    ({ className, spacing, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(modalContentVariants({ spacing }), className)}
            {...props}
        />
    )
);

ModalContent.displayName = "ModalContent";

// Modal Footer Component
const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
    ({ className, align, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(modalFooterVariants({ align }), className)}
            {...props}
        />
    )
);

ModalFooter.displayName = "ModalFooter";

// Modal Title Component
const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
    ({ className, as = "h2", ...props }, ref) => {
        const Component = as;
        return (
            <Component
                ref={ref}
                className={cn(
                    "text-xl font-semibold leading-none tracking-tight text-base-content",
                    className
                )}
                {...props}
            />
        );
    }
);

ModalTitle.displayName = "ModalTitle";

// Modal Description Component
const ModalDescription = forwardRef<
    HTMLParagraphElement,
    ModalDescriptionProps
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-base-content/70 mt-2", className)}
        {...props}
    />
));

ModalDescription.displayName = "ModalDescription";

// Convenience Components

// Confirmation Modal
export const ConfirmModal = forwardRef<
    HTMLDivElement,
    Omit<ModalProps, "size">
>(({ children, ...props }, ref) => (
    <Modal ref={ref} size="sm" animation="bounce" {...props}>
        {children}
    </Modal>
));

ConfirmModal.displayName = "ConfirmModal";

// Info Modal
export const InfoModal = forwardRef<HTMLDivElement, Omit<ModalProps, "size">>(
    ({ children, ...props }, ref) => (
        <Modal ref={ref} size="md" animation="fade" {...props}>
            {children}
        </Modal>
    )
);

InfoModal.displayName = "InfoModal";

// Full Screen Modal
export const FullScreenModal = forwardRef<
    HTMLDivElement,
    Omit<ModalProps, "size">
>(({ children, className, ...props }, ref) => (
    <Modal
        ref={ref}
        size="full"
        animation="slide"
        className={cn("h-[95vh]", className)}
        {...props}
    >
        {children}
    </Modal>
));

FullScreenModal.displayName = "FullScreenModal";

// Export all components
export {
    Modal,
    ModalHeader,
    ModalContent,
    ModalFooter,
    ModalTitle,
    ModalDescription,
};

// Default export
export default Modal;

