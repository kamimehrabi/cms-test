This is a [Next.js](https://nextjs.org) project that demonstrates **Virtual DOM rendering within Shadow DOM**.

## Features 

✨ **Virtual DOM-like rendering** - Convert JSON configurations to actual DOM elements  
🕳️ **Shadow DOM isolation** - Style and behavior isolation for widgets  
📦 **Custom Elements** - Web Components with dynamic configuration  
🔧 **JSON-driven UI** - Create entire UIs from JSON configurations  

## Getting Start

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

test commit on this readme

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Virtual DOM in Web components

This project implements a lightweight virtual DOM renderer that converts JSON to actual DOM elements within Shadow DOM. Here's how it works:

### Basic Structure

A virtual DOM node has this structure:

```json
{
  "type": "div",
  "props": {
    "className": "container",
    "style": {
      "padding": "20px",
      "backgroundColor": "#f5f5f5"
    },
    "children": [
      {
        "type": "p",
        "props": { "children": "Hello" }
      }
    ]
  }
}
```

### Supported Props

- **`className`** - CSS class names
- **`style`** - Object with CSS properties
- **`children`** - Array or single child element (can be text, number, or vNode object)
- **`data-*`** - Custom data attributes
- **`dangerouslySetInnerHTML`** - Set raw HTML content
- Any other HTML attributes

### Usage

#### Method 1: Load from JSON file

```html
<simple-shadow-widget config-url="/widgets/my-config.json"></simple-shadow-widget>
```

#### Method 2: Inline config

```html
<simple-shadow-widget config='{"type":"div","props":{"children":"Hello"}}'></simple-shadow-widget>
```

### Example Configurations

See examples in:
- `public/widgets/simple-config.json` - Basic example
- `public/widgets/complex-config.json` - Advanced with nested elements

### How It Works

1. **Shadow DOM creation** - Each widget creates its own Shadow DOM for isolation
2. **JSON parsing** - Config can be loaded from URL or provided inline
3. **VDOM rendering** - `renderVDOM()` function recursively converts JSON to DOM elements
4. **Lifecycle hooks** - Widget mounts, updates, and unmounts properly

This approach gives you the benefits of Virtual DOM (declarative JSON → DOM) with Shadow DOM encapsulation!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
