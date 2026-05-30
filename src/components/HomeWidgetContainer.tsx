'use client'
import React from 'react'

// Generic reusable wrapper component for any custom element
interface WidgetWrapperProps {
    widgetName: string
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
    widgetName,
    className,
    style,
    children
}) => {
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (ref.current && customElements.get(widgetName)) {
            // Don't create widget if children are provided (let them render it)
            if (!children && !ref.current.querySelector(widgetName)) {
                const widget = document.createElement(widgetName)
                ref.current.appendChild(widget)
            }
        }
    }, [widgetName, children])

    return <div ref={ref} className={className} style={style}>
        {children}
    </div>
}
