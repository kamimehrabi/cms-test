export default function loadDynamicContent(content: string, context: any) {
    const contextName = content.split('.')[0].replace('{', '').replace('}', '');
    if (!context) return '';
    return content.replace(/\{([^}]+)\}/g, (_, path) => {
        const keys = path.split('.');
        let current: any = context;

        if (keys[0] === contextName) keys.shift();

        for (const key of keys) {
            if (current == null) return '';
            current = current[key];
        }

        return typeof current === 'string' || typeof current === 'number' ? String(current) : '';
    });
};