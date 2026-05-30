# Modal Component

A fully-featured, accessible modal dialog component built with React, TypeScript, and Tailwind CSS following your design system patterns.

## Features

- ✅ **Multiple Variants** - Different sizes, animations, and backdrop styles
- ✅ **Accessibility** - ARIA attributes, focus management, keyboard navigation
- ✅ **Portal Rendering** - Renders outside DOM hierarchy for proper z-index
- ✅ **Customizable** - Extensive props for customization
- ✅ **Sub-components** - Header, Content, Footer, Title, Description
- ✅ **Convenience Components** - ConfirmModal, InfoModal, FullScreenModal
- ✅ **TypeScript** - Full type safety
- ✅ **Animations** - Smooth enter/exit animations
- ✅ **Body Scroll Lock** - Prevents scrolling when open
- ✅ **ESC Key** - Close on escape key press
- ✅ **Backdrop Click** - Close on backdrop click (optional)

## Installation

The Modal component is already integrated into your atoms folder:

```tsx
import { Modal, ModalHeader, ModalContent, ModalFooter } from "@/src/components/atoms/Modal";
```

## Basic Usage

```tsx
import { useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter, ModalTitle } from "@/src/components/atoms/Modal";
import { Button } from "@/src/components/atoms/Button";

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
        </ModalHeader>
        <ModalContent>
          <p>Your content here...</p>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

## Props

### Modal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | required | Controls modal visibility |
| `onClose` | `() => void` | required | Callback when modal should close |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "full"` | `"md"` | Modal size |
| `animation` | `"scale" \| "slide" \| "fade" \| "bounce"` | `"scale"` | Entry animation |
| `backdrop` | `"blur" \| "solid" \| "light" \| "dark" \| "transparent"` | `"blur"` | Backdrop style |
| `closeOnBackdrop` | `boolean` | `true` | Close when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Close on ESC key press |
| `showCloseButton` | `boolean` | `true` | Show X button in corner |
| `preventScroll` | `boolean` | `true` | Prevent body scroll when open |
| `portal` | `boolean` | `true` | Render in React portal |
| `portalContainer` | `HTMLElement` | `document.body` | Portal container element |

### ModalHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "primary" \| "secondary" \| "accent"` | `"default"` | Header style variant |

### ModalContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spacing` | `"none" \| "tight" \| "normal" \| "relaxed"` | `"normal"` | Content padding |

### ModalFooter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"left" \| "center" \| "right" \| "between"` | `"right"` | Footer alignment |

## Size Variants

```tsx
<Modal size="sm">...</Modal>  // 384px max width
<Modal size="md">...</Modal>  // 448px max width
<Modal size="lg">...</Modal>  // 512px max width
<Modal size="xl">...</Modal>  // 576px max width
<Modal size="2xl">...</Modal> // 672px max width
<Modal size="3xl">...</Modal> // 768px max width
<Modal size="4xl">...</Modal> // 896px max width
<Modal size="full">...</Modal> // 95vw max width
```

## Animation Variants

```tsx
<Modal animation="scale">...</Modal>   // Zoom in
<Modal animation="slide">...</Modal>   // Slide from bottom
<Modal animation="fade">...</Modal>    // Fade in
<Modal animation="bounce">...</Modal>  // Bounce in
```

## Backdrop Variants

```tsx
<Modal backdrop="blur">...</Modal>        // Blurred backdrop (default)
<Modal backdrop="solid">...</Modal>       // Solid dark backdrop
<Modal backdrop="light">...</Modal>       // Light backdrop
<Modal backdrop="dark">...</Modal>        // Dark backdrop
<Modal backdrop="transparent">...</Modal> // No backdrop
```

## Convenience Components

### ConfirmModal

Pre-configured for confirmation dialogs:

```tsx
import { ConfirmModal, ModalHeader, ModalContent, ModalFooter } from "@/src/components/atoms/Modal";

<ConfirmModal open={open} onClose={onClose}>
  <ModalHeader>
    <ModalTitle>Delete Account?</ModalTitle>
  </ModalHeader>
  <ModalContent>
    <ModalDescription>
      This action cannot be undone.
    </ModalDescription>
  </ModalContent>
  <ModalFooter align="between">
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button variant="primary" onClick={handleDelete}>Delete</Button>
  </ModalFooter>
</ConfirmModal>
```

### InfoModal

Pre-configured for informational content:

```tsx
import { InfoModal, ModalHeader, ModalContent } from "@/src/components/atoms/Modal";

<InfoModal open={open} onClose={onClose}>
  <ModalHeader variant="primary">
    <ModalTitle>Information</ModalTitle>
  </ModalHeader>
  <ModalContent>
    <p>Your informational content here...</p>
  </ModalContent>
</InfoModal>
```

### FullScreenModal

Pre-configured for full-screen content:

```tsx
import { FullScreenModal, ModalHeader, ModalContent } from "@/src/components/atoms/Modal";

<FullScreenModal open={open} onClose={onClose}>
  <ModalHeader>
    <ModalTitle>Full Screen View</ModalTitle>
  </ModalHeader>
  <ModalContent>
    <p>Your large content here...</p>
  </ModalContent>
</FullScreenModal>
```

## Advanced Examples

### Form Modal

```tsx
<Modal open={open} onClose={onClose} size="lg">
  <ModalHeader>
    <ModalTitle>User Registration</ModalTitle>
    <ModalDescription>Create your account</ModalDescription>
  </ModalHeader>
  <ModalContent>
    <form className="space-y-4">
      <Input label="Email" type="email" required />
      <Input label="Password" type="password" required />
      <Input label="Confirm Password" type="password" required />
    </form>
  </ModalContent>
  <ModalFooter align="right">
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button variant="primary" onClick={handleSubmit}>Register</Button>
  </ModalFooter>
</Modal>
```

### Nested Modals

```tsx
function NestedModalExample() {
  const [firstOpen, setFirstOpen] = useState(false);
  const [secondOpen, setSecondOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setFirstOpen(true)}>Open First</Button>

      <Modal open={firstOpen} onClose={() => setFirstOpen(false)}>
        <ModalContent>
          <Button onClick={() => setSecondOpen(true)}>Open Second</Button>
        </ModalContent>
      </Modal>

      <Modal open={secondOpen} onClose={() => setSecondOpen(false)}>
        <ModalContent>
          <p>Second modal</p>
        </ModalContent>
      </Modal>
    </>
  );
}
```

### Custom Styling

```tsx
<Modal
  open={open}
  onClose={onClose}
  size="xl"
  animation="slide"
  backdrop="dark"
  className="border-4 border-primary"
>
  <ModalHeader variant="accent" className="bg-gradient-to-r from-primary to-secondary">
    <ModalTitle className="text-white">Custom Styled Modal</ModalTitle>
  </ModalHeader>
  <ModalContent spacing="relaxed">
    <p>Your custom content...</p>
  </ModalContent>
</Modal>
```

### Without Close Button

```tsx
<Modal open={open} onClose={onClose} showCloseButton={false}>
  <ModalContent>
    <p>No close button - use buttons below</p>
  </ModalContent>
  <ModalFooter>
    <Button onClick={onClose}>Close</Button>
  </ModalFooter>
</Modal>
```

### No Backdrop Close

```tsx
<Modal
  open={open}
  onClose={onClose}
  closeOnBackdrop={false}
  closeOnEscape={false}
>
  <ModalContent>
    <p>Must use button to close</p>
  </ModalContent>
  <ModalFooter>
    <Button onClick={onClose}>Close</Button>
  </ModalFooter>
</Modal>
```

## Accessibility

The Modal component follows accessibility best practices:

- **ARIA Attributes**: `role="dialog"`, `aria-modal="true"`
- **Focus Management**: Traps focus within modal when open
- **Keyboard Navigation**: ESC key closes modal (configurable)
- **Screen Readers**: Proper semantic HTML structure

## Best Practices

1. **Always provide onClose**: Even if you disable backdrop/ESC closing
2. **Use ModalTitle**: Helps screen readers identify the modal purpose
3. **Footer Alignment**: Use `align="between"` for Cancel/Confirm buttons
4. **Content Overflow**: Content area scrolls automatically if too tall
5. **Loading States**: Show loading indicators during async operations
6. **Error Handling**: Display errors within modal, don't auto-close on error

## Integration with Your No-Code Builder

This Modal component is perfect for your no-code builder:

```typescript
// Generated code example
<Modal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  size="lg"
>
  <ModalHeader>
    <ModalTitle>{modalConfig.title}</ModalTitle>
  </ModalHeader>
  <ModalContent>
    {renderDynamicContent(modalConfig.content)}
  </ModalContent>
  <ModalFooter align="right">
    {modalConfig.buttons.map(btn => (
      <Button key={btn.id} {...btn.props}>{btn.label}</Button>
    ))}
  </ModalFooter>
</Modal>
```

## TypeScript Support

Full TypeScript support with exported interfaces:

```typescript
import type {
  ModalProps,
  ModalHeaderProps,
  ModalContentProps,
  ModalFooterProps,
  ModalTitleProps,
  ModalDescriptionProps,
} from "@/src/components/atoms/Modal";
```

## Browser Support

Works in all modern browsers with React 18+ and Tailwind CSS 3+.

## Notes

- Modal renders in a React Portal by default for proper z-index stacking
- Body scroll is automatically prevented when modal is open
- Clicking backdrop or pressing ESC closes the modal (configurable)
- Smooth animations using Tailwind's animate-in utilities

