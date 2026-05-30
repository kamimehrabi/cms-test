# Input Component

A fully-featured, reusable input component built with class-variance-authority and following the project's design system.

## Features

- ✅ **Multiple Variants**: default, primary, secondary, error, success
- ✅ **Size Options**: sm, md, lg
- ✅ **Label Types**: Standard and Floating labels
- ✅ **Input Types**: text, email, password, number, tel, url, date, and more
- ✅ **Icon Support**: Left and right icon slots
- ✅ **Password Toggle**: Show/hide password functionality
- ✅ **Clearable**: Clear button for quick value reset
- ✅ **Validation**: Error states with messages
- ✅ **Helper Text**: Additional context for users
- ✅ **Character Count**: Display current/max character count
- ✅ **Accessibility**: Proper ARIA attributes and keyboard navigation
- ✅ **TypeScript**: Full type safety with TypeScript

## Installation

The component is already set up in your project. Import it like this:

```tsx
import { Input } from "@/components/atoms/Input";
```

## Basic Usage

### Simple Text Input

```tsx
<Input
  label="Username"
  placeholder="Enter your username"
  onChange={(e) => console.log(e.target.value)}
/>
```

### With Floating Label

```tsx
<Input
  label="Email Address"
  floatingLabel
  type="email"
  onChange={(e) => console.log(e.target.value)}
/>
```

### Password Input with Toggle

```tsx
<Input
  label="Password"
  type="password"
  showPasswordToggle
  placeholder="Enter your password"
  onChange={(e) => console.log(e.target.value)}
/>
```

### With Icons

```tsx
<Input
  label="Search"
  placeholder="Search..."
  leftIcon={
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  }
  clearable
/>
```

### With Validation

```tsx
const [value, setValue] = useState("");
const [error, setError] = useState("");

const handleChange = (e) => {
  setValue(e.target.value);
  if (e.target.value.length < 3) {
    setError("Minimum 3 characters required");
  } else {
    setError("");
  }
};

<Input
  label="Username"
  value={value}
  onChange={handleChange}
  error={error}
  helperText="Choose a unique username"
/>;
```

### With Character Count

```tsx
<Input
  label="Bio"
  maxLength={100}
  showCharCount
  placeholder="Tell us about yourself"
  helperText="Share a brief description"
/>
```

## Props

| Prop                 | Type                                                            | Default     | Description                                              |
| -------------------- | --------------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `label`              | `string`                                                        | -           | Label text for the input                                 |
| `floatingLabel`      | `boolean`                                                       | `false`     | Enable floating label animation                          |
| `placeholder`        | `string`                                                        | -           | Placeholder text (ignored if floatingLabel is true)      |
| `type`               | `string`                                                        | `"text"`    | HTML input type (text, email, password, etc.)            |
| `variant`            | `"default" \| "primary" \| "secondary" \| "error" \| "success"` | `"default"` | Visual style variant                                     |
| `size`               | `"sm" \| "md" \| "lg"`                                          | `"md"`      | Input size                                               |
| `error`              | `string`                                                        | -           | Error message to display                                 |
| `helperText`         | `string`                                                        | -           | Helper text below input                                  |
| `leftIcon`           | `ReactNode`                                                     | -           | Icon to display on the left                              |
| `rightIcon`          | `ReactNode`                                                     | -           | Icon to display on the right                             |
| `clearable`          | `boolean`                                                       | `false`     | Show clear button when input has value                   |
| `showPasswordToggle` | `boolean`                                                       | `false`     | Show password visibility toggle (only for password type) |
| `maxLength`          | `number`                                                        | -           | Maximum character length                                 |
| `showCharCount`      | `boolean`                                                       | `false`     | Display character count                                  |
| `disabled`           | `boolean`                                                       | `false`     | Disable the input                                        |
| `required`           | `boolean`                                                       | `false`     | Mark as required field                                   |
| `fullWidth`          | `boolean`                                                       | `true`      | Take full width of container                             |
| `containerClassName` | `string`                                                        | -           | Additional classes for container                         |
| `labelClassName`     | `string`                                                        | -           | Additional classes for label                             |
| `inputClassName`     | `string`                                                        | -           | Additional classes for input                             |
| `className`          | `string`                                                        | -           | Additional classes (merged with input)                   |

## Variants

### Default

Standard input style with base colors.

```tsx
<Input variant="default" label="Default Input" />
```

### Primary

Uses primary theme colors.

```tsx
<Input variant="primary" label="Primary Input" />
```

### Secondary

Uses secondary theme colors.

```tsx
<Input variant="secondary" label="Secondary Input" />
```

### Error

Red border and styling for errors (automatically applied when `error` prop is provided).

```tsx
<Input variant="error" label="Error Input" error="This field is required" />
```

### Success

Green border and styling for valid inputs.

```tsx
<Input variant="success" label="Valid Input" />
```

## Sizes

```tsx
<Input size="sm" label="Small" />
<Input size="md" label="Medium" />
<Input size="lg" label="Large" />
```

## Advanced Examples

### Form with Multiple Inputs

```tsx
<form className="space-y-4">
  <Input label="Full Name" type="text" required placeholder="John Doe" />

  <Input
    label="Email"
    type="email"
    required
    floatingLabel
    leftIcon={<MailIcon />}
  />

  <Input
    label="Password"
    type="password"
    required
    showPasswordToggle
    helperText="Must be at least 8 characters"
  />

  <Input
    label="Phone Number"
    type="tel"
    placeholder="+1 (555) 000-0000"
    leftIcon={<PhoneIcon />}
  />
</form>
```

### Controlled Input with React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { Input } from "@/components/atoms/Input";

function MyForm() {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <Input
      {...register("email", {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      })}
      label="Email"
      type="email"
      error={errors.email?.message}
      floatingLabel
    />
  );
}
```

### Search Input

```tsx
const [search, setSearch] = useState('')

<Input
  placeholder="Search..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  clearable
  leftIcon={
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  }
/>
```

## Styling

The component uses your project's design system tokens:

- `primary`, `secondary`, `accent`, `neutral` - theme colors
- `base-content`, `base-200`, `base-300` - base colors
- `error`, `success`, `warning` - status colors

You can override styles using the `className` props:

- `containerClassName` - for the outer wrapper
- `labelClassName` - for the label
- `inputClassName` - for the input field itself
- `className` - merged with input field classes

## Accessibility

The Input component follows accessibility best practices:

- Proper label association
- ARIA attributes for error states
- Keyboard navigation support
- Focus states and visual indicators
- Required field indicators
- Screen reader friendly error messages

## Browser Support

Works in all modern browsers that support:

- CSS Grid and Flexbox
- CSS Custom Properties
- ES6+ JavaScript
