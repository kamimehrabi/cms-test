/**
 * Icon Atom - Consistent icon component with accessibility
 * Following Atomic Design principles and WCAG guidelines
 */

import React, { forwardRef } from 'react';
import { cn } from '@sglara/cn';
import * as ReactIcon from 'react-icons/fa6';

export type IconName = keyof typeof ReactIcon;

// Custom icon mappings for common aliases
const iconMappings: Record<string, keyof typeof ReactIcon> = {
    'Location': 'FaLocationDot',
    'Map': 'FaLocationDot',
    'Pin': 'FaLocationDot',
    'Address': 'FaLocationDot',
    'Call': 'FaPhone',
    'Telephone': 'FaPhone',
    'Email': 'FaEnvelope',
    'Message': 'FaMessage',
    'Chat': 'FaMessage',
    'Home': 'FaHouse',
    'User': 'FaUser',
    'Profile': 'FaUser',
    'Facebook': 'FaFacebook',
    'Instagram': 'FaInstagram',
    'Twitter': 'FaTwitter',
    'Linkedin': 'FaLinkedin',
    'Youtube': 'FaYoutube',
    'Tiktok': 'FaTiktok',
    'Pinterest': 'FaPinterest',
    'Account': 'FaUser',
    'Settings': 'FaGear',
    'Config': 'FaGear',
    'Gear': 'FaGear',
    'Search': 'FaMagnifyingGlass',
    'Find': 'FaMagnifyingGlass',
    'Menu': 'FaBars',
    'Hamburger': 'FaBars',
    'Close': 'FaXmark',
    'Cancel': 'FaXmark',
    'Delete': 'FaTrash',
    'Remove': 'FaTrash',
    'Edit': 'FaPen',
    'Modify': 'FaPen',
    'Save': 'FaFloppyDisk',
    'Download': 'FaDownload',
    'Upload': 'FaUpload',
    'Plus': 'FaPlus',
    'Add': 'FaPlus',
    'Minus': 'FaMinus',
    'Subtract': 'FaMinus',
    'Check': 'FaCheck',
    'Success': 'FaCheck',
    'Error': 'FaCircleExclamation',
    'Warning': 'FaTriangleExclamation',
    'Info': 'FaCircleInfo',
    'Loading': 'FaSpinner',
    'Spinner': 'FaSpinner',
    'Clock': 'FaClock',
};

export const Icon = forwardRef<SVGSVGElement, any>(
    (
        {
            className,
            name,
            size = 'md',
            variant = 'default',
            color,
            strokeWidth = 3,
            filled = false,
            spin = false,
            pulse = false,
            'data-testid': testId,
            'aria-label': ariaLabel,
            'aria-hidden': ariaHidden,
            ...props
        },
        ref
    ) => {
        // Resolve icon name through mapping if needed
        const resolvedName = iconMappings[name] || name;
        const IconComponent = ReactIcon[resolvedName] as React.ComponentType<any>;

        if (!IconComponent) {
            console.warn(`Icon "${name}" not found in React Icon`);
            return null;
        }

        const sizeClasses = {
            xs: 'h-3 w-3 text-xs',
            sm: 'h-4 w-4 text-sm',
            md: 'h-5 w-5 text-base',
            lg: 'h-6 w-6 text-lg',
            xl: 'h-8 w-8 text-xl',
        };

        const variantClasses = {
            default: 'text-base-content',
            primary: 'text-primary-content',
            secondary: 'text-base-content',
            success: 'text-success-content',
            warning: 'text-warning-content',
            error: 'text-error-content',
            info: 'text-info-content',
        };

        const classes = cn(
            // Base styles
            'inline-block flex-shrink-0',

            // Size
            typeof size === 'string' ? sizeClasses[size as keyof typeof sizeClasses] : undefined,

            // Variant colors
            !color && variantClasses[variant as keyof typeof variantClasses],

            // Animations
            {
                'animate-spin': spin,
                'animate-pulse': pulse,
            },

            className
        );

        // Handle numeric size with inline styles for FontAwesome
        const sizeStyle = typeof size === 'number' ? { fontSize: `${size}px` } : undefined;

        return (
            <IconComponent
                ref={ref}
                className={classes}
                style={{ ...sizeStyle, ...(color ? { color } : {}) }}
                data-testid={testId}
                aria-label={ariaLabel}
                aria-hidden={ariaHidden ?? (!ariaLabel ? true : undefined)}
                {...props}
            />
        );
    }
);

Icon.displayName = 'Icon';

export default Icon;
