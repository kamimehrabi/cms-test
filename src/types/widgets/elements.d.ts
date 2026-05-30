// src/types/custom-elements.d.ts

export declare global {
    interface Window {
        __editMode: boolean;
    }

    namespace JSX {
        export interface IntrinsicElements {
            HomeWidgetContainer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'simple-shadow-widget': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    'config'?: string;
                    'config-url'?: string;
                },
                HTMLElement
            >;
            'app-shadow-dom': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}
