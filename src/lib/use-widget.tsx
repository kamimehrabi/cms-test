"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Reusable hook for mounting widgets
export function useWidgetMount(widgetName: string, hostId?: string) {
    useEffect(() => {
        const mountWidget = () => {
            const host = hostId ? document.getElementById(hostId) : document.body
            if (host && customElements.get(widgetName)) {
                if (!host.querySelector(widgetName)) {
                    const widget = document.createElement(widgetName)
                    host.appendChild(widget)
                }
            }
        }

        if (customElements.get(widgetName)) {
            mountWidget()
        } else {
            customElements.whenDefined(widgetName).then(() => {
                mountWidget()
            })
        }
    }, [widgetName, hostId])
}

// Reusable hook for widget navigation
export function useWidgetNavigation() {
    const router = useRouter()

    useEffect(() => {
        const handleWidgetNavigation = (event: CustomEvent) => {
            const { route } = event.detail
            router.push(route)
        }

        window.addEventListener('widget-navigation', handleWidgetNavigation as EventListener)

        return () => {
            window.removeEventListener('widget-navigation', handleWidgetNavigation as EventListener)
        }
    }, [router])
}

// Combined hook for common widget functionality
export function useWidget(widgetName: string, hostId?: string) {
    useWidgetMount(widgetName, hostId)
    useWidgetNavigation()
}

