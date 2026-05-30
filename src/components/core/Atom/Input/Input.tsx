"use client";
import React, { useState, forwardRef, InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@sglara/cn";

const inputVariants = cva(
  "w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-background text-base-content placeholder:text-base-content/50 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-base-200",
  {
    variants: {
      variant: {
        default:
          "border-base-200 hover:border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
        primary:
          "border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20",
        secondary:
          "border-secondary/30 focus:border-secondary focus:ring-2 focus:ring-secondary/20",
        error:
          "border-error focus:border-error focus:ring-2 focus:ring-error/20",
        success:
          "border-success focus:border-success focus:ring-2 focus:ring-success/20",
      },
      size: {
        sm: "h-9 text-sm px-3 py-2",
        md: "h-11 text-base px-4 py-3",
        lg: "h-13 text-lg px-5 py-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const labelVariants = cva(
  "block font-semibold mb-2 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "text-base-content",
        primary: "text-primary",
        secondary: "text-secondary",
        error: "text-error",
        success: "text-success",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
  VariantProps<typeof inputVariants> {
  label?: string;
  floatingLabel?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    floatingLabel = false,
    error,
    helperText,
    leftIcon,
    rightIcon,
    clearable = false,
    showPasswordToggle = false,
    maxLength,
    max,
    min,
    showCharCount = false,
    variant,
    size,
    type = "text",
    disabled = false,
    required = false,
    placeholder,
    containerClassName,
    labelClassName,
    inputClassName,
    fullWidth = true,
    className,
    value,
    onChange,
    ...props
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const effectiveVariant = error ? "error" : variant;

  const hasValue =
    inputValue !== "" && inputValue !== null && inputValue !== undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    const syntheticEvent = {
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    setInputValue("");
    onChange?.(syntheticEvent);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  const shouldShowPasswordToggle = type === "password" && showPasswordToggle;
  const shouldShowClearButton = clearable && hasValue && !disabled;

  const hasLeftIcon = !!leftIcon;
  const hasRightContent =
    shouldShowPasswordToggle || shouldShowClearButton || !!rightIcon;

  return (
    <div className={cn(fullWidth ? "w-full" : "", containerClassName)}>
      {/* Standard Label */}
      {label && !floatingLabel && (
        <label
          className={cn(
            labelVariants({ variant: effectiveVariant, size }),
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Floating Label */}
        {label && floatingLabel && (
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none",
              isFocused || hasValue
                ? "top-0 -translate-y-1/2 text-xs bg-background px-1"
                : "top-1/2 -translate-y-1/2 text-base",
              effectiveVariant === "error"
                ? "text-error"
                : isFocused
                  ? "text-primary"
                  : "text-base-content/50",
              hasLeftIcon && !(isFocused || hasValue) ? "left-12" : "left-4"
            )}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          required={required}
          placeholder={floatingLabel ? undefined : placeholder}
          maxLength={maxLength}
          value={inputValue}
          max={max}
          min={min}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            inputVariants({ variant: effectiveVariant, size }),
            hasLeftIcon && "pl-12",
            hasRightContent && "pr-12",
            inputClassName,
            className
          )}
          {...props}
        />

        {/* Right Side Controls */}
        {hasRightContent && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Clear Button */}
            {shouldShowClearButton && (
              <button
                type="button"
                onClick={handleClear}
                className="text-base-content/50 hover:text-base-content transition-colors"
                tabIndex={-1}
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

            {/* Password Toggle */}
            {shouldShowPasswordToggle && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-base-content/50 hover:text-base-content transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon &&
              !shouldShowPasswordToggle &&
              !shouldShowClearButton && (
                <div className="text-base-content/50">{rightIcon}</div>
              )}
          </div>
        )}
      </div>

      {/* Helper Text, Error Message, and Character Count */}
      {(error || helperText || (showCharCount && maxLength)) && (
        <div className="flex items-center justify-between mt-1 min-h-[20px]">
          <div className="flex-1">
            {error ? (
              <div className="text-sm text-error flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            ) : helperText ? (
              <span className="text-sm text-base-content/60">{helperText}</span>
            ) : null}
          </div>
          {showCharCount && maxLength && (
            <span
              className={cn(
                "text-xs",
                String(inputValue).length > maxLength * 0.9
                  ? "text-warning"
                  : "text-base-content/50"
              )}
            >
              {String(inputValue).length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
);

Input.displayName = "Input";

export default Input;
