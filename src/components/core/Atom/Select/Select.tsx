"use client";
import React, { useState, useRef, useEffect } from "react";
// import "../../../app/globals.css"

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface BaseSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  error?: string;
  className?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
  clearable?: boolean;
}

export interface SingleSelectProps extends BaseSelectProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

export interface MultiSelectProps extends BaseSelectProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  showSelectAll?: boolean;
  showClearAll?: boolean;
  maxDisplay?: number;
}

export type SelectProps = SingleSelectProps | MultiSelectProps;

export const Select: React.FC<SelectProps> = (props) => {
  const {
    label,
    placeholder = "Select an option",
    value,
    onChange,
    options,
    disabled = false,
    error,
    className = "",
    labelClassName = "",
    icon,
    searchable = false,
    clearable = false,
  } = props;

  const multiple = props.multiple || false;
  const showSelectAll =
    multiple && (props as MultiSelectProps).showSelectAll !== false;
  const showClearAll =
    multiple && (props as MultiSelectProps).showClearAll !== false;
  const maxDisplay = multiple ? (props as MultiSelectProps).maxDisplay || 2 : 1;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : options;

  // Helper functions for multi-select
  const isSelected = (optionValue: string): boolean => {
    if (multiple) {
      return (value as string[]).includes(optionValue);
    }
    return value === optionValue;
  };

  const areAllSelected = (): boolean => {
    if (!multiple) return false;
    const selectableOptions = options.filter((opt) => !opt.disabled);
    return selectableOptions.every((opt) =>
      (value as string[]).includes(opt.value)
    );
  };

  // Find selected option for display (single select)
  const selectedOption = !multiple
    ? options.find((option) => option.value === value)
    : null;

  // Get selected options for multi-select display
  const selectedOptions = multiple
    ? options.filter((option) => (value as string[]).includes(option.value))
    : [];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = value as string[];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      (onChange as (value: string[]) => void)(newValues);
    } else {
      (onChange as (value: string) => void)(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      const allValues = options
        .filter((opt) => !opt.disabled)
        .map((opt) => opt.value);
      (onChange as (value: string[]) => void)(allValues);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      (onChange as (value: string[]) => void)([]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      (onChange as (value: string[]) => void)([]);
    } else {
      (onChange as (value: string) => void)("");
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Label */}
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${labelClassName}`}>
          {label}
        </label>
      )}

      {/* Select Trigger */}
      <div
        className={`
                    relative w-full px-4 py-3 border rounded-lg cursor-pointer
                    transition-all duration-200 bg-background
                    ${error
            ? "border-error focus-within:border-error focus-within:ring-2 focus-within:ring-error"
            : "border-base-200 hover:border-base-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary"
          }
                    ${disabled
            ? "bg-base-200 cursor-not-allowed opacity-60"
            : ""
          }
                `}
        onClick={toggleDropdown}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            {icon && <span className="text-base-primary/50">{icon}</span>}

            {/* Single Select Display */}
            {!multiple && (
              <span
                className={`${selectedOption ? "text-base-content" : "text-base-content/50"
                  }`}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            )}

            {/* Multi Select Display */}
            {multiple && (
              <div className="flex items-center gap-2 flex-wrap flex-1">
                {selectedOptions.length === 0 ? (
                  <span className="text-base-content/50">{placeholder}</span>
                ) : (
                  <>
                    {selectedOptions.slice(0, maxDisplay).map((opt) => (
                      <span
                        key={opt.value}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                      >
                        {opt.label}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionClick(opt.value);
                          }}
                          className="hover:text-primary-focus"
                          type="button"
                        >
                          <svg
                            className="w-3 h-3"
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
                      </span>
                    ))}
                    {selectedOptions.length > maxDisplay && (
                      <span className="text-xs text-base-content/60 font-medium">
                        +{selectedOptions.length - maxDisplay} more
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {clearable &&
              ((multiple && selectedOptions.length > 0) ||
                (!multiple && value)) &&
              !disabled && (
                <button
                  onClick={handleClear}
                  className="text-base-content/50 hover:text-base-content transition-colors"
                  type="button"
                >
                  <svg
                    className="w-4 h-4"
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

            <svg
              className={`w-5 h-5 text-base-content/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-base-200 rounded-lg shadow-lg shadow-primary/20 max-h-80 overflow-hidden">
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-base-200">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-base-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-base-content"
              />
            </div>
          )}

          {/* Select All / Clear All Buttons (Multi-select only) */}
          {multiple && (showSelectAll || showClearAll) && (
            <div className="flex items-center gap-2 p-2 border-b border-base-200 bg-base-100">
              {showSelectAll && (
                <button
                  onClick={handleSelectAll}
                  disabled={areAllSelected()}
                  className="flex-1 px-3 py-1.5 border border-primary/20 hover:border-primary text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  Select All
                </button>
              )}
              {showClearAll && (
                <button
                  onClick={handleClearAll}
                  disabled={selectedOptions.length === 0}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-base-content/70 hover:bg-base-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  Clear All
                </button>
              )}
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() =>
                    !option.disabled && handleOptionClick(option.value)
                  }
                  className={`
                                        px-4 py-3 cursor-pointer transition-colors duration-150
                                        ${isSelected(option.value)
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-base-200 text-base-content"
                    }
                                        ${option.disabled
                      ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                      : ""
                    }
                                    `}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Multi-select checkbox */}
                    {multiple && (
                      <div className="flex items-center">
                        <div
                          className={`
                                                    w-4 h-4 border-2 rounded flex items-center justify-center
                                                    ${isSelected(option.value)
                              ? "bg-primary border-primary"
                              : "border-base-300"
                            }
                                                `}
                        >
                          {isSelected(option.value) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}

                    <span className="flex-1">{option.label}</span>

                    {/* Single-select checkmark */}
                    {!multiple && isSelected(option.value) && (
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-base-content/60 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

