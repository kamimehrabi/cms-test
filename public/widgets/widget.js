// Virtual DOM renderer - converts JSON to actual DOM elements
function renderVDOM(vNode) {
    // Handle different vNode types
    if (typeof vNode === 'string' || typeof vNode === 'number') {
        return document.createTextNode(String(vNode));
    }

    if (!vNode || typeof vNode !== 'object') {
        return document.createTextNode('');
    }

    const { type, props } = vNode;

    if (!type) {
        return document.createTextNode('');
    }

    // Create the element
    const element = document.createElement(type);

    // Apply props
    if (props) {
        Object.keys(props).forEach(key => {
            const value = props[key];

            // Handle children specially - it's not a DOM attribute
            if (key === 'children') {
                return; // We'll handle this separately
            }

            // Handle events (onClick, onMouseOver, etc.)
            if (key.startsWith('on') && typeof value === 'function') {
                const eventType = key.slice(2).toLowerCase();
                element.addEventListener(eventType, value);
                return;
            }

            // Handle style object
            if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
                return;
            }

            // Handle className
            if (key === 'className') {
                element.className = value;
                return;
            }

            // Handle dangerouslySetInnerHTML
            if (key === 'dangerouslySetInnerHTML' && value && value.__html) {
                element.innerHTML = value.__html;
                return;
            }

            // Handle data attributes
            if (key.startsWith('data-')) {
                element.setAttribute(key, value);
                return;
            }

            // Handle ref callback
            if (key === 'ref' && typeof value === 'function') {
                value(element);
                return;
            }

            // Default: set as attribute
            element.setAttribute(key, value);
        });
    }

    // Handle children
    if (props && props.children) {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach(child => {
            if (child !== null && child !== undefined) {
                const childNode = renderVDOM(child);
                if (childNode) {
                    element.appendChild(childNode);
                }
            }
        });
    }

    return element;
}

// SimpleShadowWidget with Virtual DOM support
class SimpleShadowWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.vNode = null;
    }

    // Method to update the virtual DOM from JSON
    setVDOM(vNodeJSON) {
        this.vNode = vNodeJSON;
        this.render();
    }

    // Render method that converts virtual DOM to actual DOM
    render() {
        if (!this.vNode) {
            return;
        }

        // Clear existing content
        this.shadowRoot.innerHTML = '';

        // Render the virtual DOM
        const element = renderVDOM(this.vNode);
        if (element) {
            this.shadowRoot.appendChild(element);
        }
    }

    connectedCallback() {
        console.log('SimpleShadowWidget connected to DOM');
        
        // Try to load from config attribute if provided
        const configAttr = this.getAttribute('config');
        if (configAttr) {
            try {
                const config = JSON.parse(configAttr);
                this.setVDOM(config);
            } catch (e) {
                console.error('Failed to parse config:', e);
                this.renderDefault();
            }
        } else {
            // Try to fetch from config URL if provided
            const configUrl = this.getAttribute('config-url');
            if (configUrl) {
                this.loadConfig(configUrl);
            } else {
                this.renderDefault();
            }
        }
    }

    // Load config from URL
    async loadConfig(url) {
        try {
            const response = await fetch(url);
            const config = await response.json();
            this.setVDOM(config);
        } catch (e) {
            console.error('Failed to load config:', e);
            this.renderDefault();
        }
    }

    // Render default content if no config is provided
    renderDefault() {
        this.setVDOM({
            type: 'div',
            props: {
                children: 'This is inside the Shadow DOM'
            }
        });
    }

    disconnectedCallback() {
        console.log('SimpleShadowWidget disconnected from DOM');
    }
}

customElements.define('simple-shadow-widget', SimpleShadowWidget);
