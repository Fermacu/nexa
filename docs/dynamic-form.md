# DynamicForm Component Documentation

A flexible, reusable form component that generates form fields based on configuration. This component uses Material-UI components and supports various field types with validation.

## Overview

The `DynamicForm` component allows you to create forms by passing a configuration object instead of manually writing form fields. This makes it easy to reuse the same form structure across the platform while maintaining consistency.

## Features

- **Multiple Field Types**: text, email, password, number, tel, url, textarea, select, multiselect, date, checkbox
- **Built-in Validation**: Required, min/max length, patterns, custom validators
- **Material-UI Integration**: Uses Material-UI components for consistent styling
- **TypeScript Support**: Fully typed for better developer experience
- **Flexible Layout**: Configurable spacing and direction
- **Error Handling**: Supports both internal and external errors

## Installation

The component is located in `src/components/DynamicForm/`. Import it like this:

```typescript
import { DynamicForm, DynamicFormConfig } from '@app/components/DynamicForm'
```

## Basic Usage

```typescript
import { DynamicForm, DynamicFormConfig } from '@app/components/DynamicForm'

const formConfig: DynamicFormConfig = {
  fields: [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email',
      validation: {
        required: true,
        email: true,
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validation: {
        required: true,
        minLength: 8,
      },
    },
  ],
  submitLabel: 'Sign In',
  spacing: 3,
}

function MyComponent() {
  const handleSubmit = async (data: FormData) => {
    console.log('Form data:', data)
    // Handle form submission
  }

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />
}
```

## Field Types

### Text Fields

```typescript
{
  name: 'firstName',
  label: 'First Name',
  type: 'text',
  placeholder: 'Enter first name',
  validation: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
}
```

Supported text types: `text`, `email`, `password`, `number`, `tel`, `url`

### Textarea

```typescript
{
  name: 'description',
  label: 'Description',
  type: 'textarea',
  rows: 4,
  validation: {
    required: true,
    maxLength: 500,
  },
}
```

### Select

```typescript
{
  name: 'country',
  label: 'Country',
  type: 'select',
  options: [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
  ],
  validation: {
    required: true,
  },
}
```

### Multi-Select

```typescript
{
  name: 'skills',
  label: 'Skills',
  type: 'multiselect',
  multiple: true,
  options: [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'react', label: 'React' },
  ],
  validation: {
    required: true,
  },
}
```

### Date

```typescript
{
  name: 'birthDate',
  label: 'Date of Birth',
  type: 'date',
  minDate: '1900-01-01',
  maxDate: new Date().toISOString().split('T')[0],
  validation: {
    required: true,
  },
}
```

### Checkbox

```typescript
{
  name: 'agreeToTerms',
  label: 'I agree to the terms and conditions',
  type: 'checkbox',
  labelPlacement: 'end',
  validation: {
    required: true,
  },
}
```

## Validation

Validation rules are defined in the `validation` property of each field:

```typescript
{
  validation: {
    required: true,           // Field is required
    minLength: 3,            // Minimum string length
    maxLength: 100,          // Maximum string length
    min: 0,                  // Minimum number value
    max: 100,                // Maximum number value
    email: true,             // Must be valid email format
    pattern: /^[A-Z]/,       // Must match regex pattern
    custom: (value) => {     // Custom validation function
      if (value === 'forbidden') {
        return 'This value is not allowed'
      }
      return null // null means valid
    },
  },
}
```

## Complete Example: Company Registration Form

```typescript
import { DynamicForm, DynamicFormConfig } from '@app/components/DynamicForm'

const companyRegistrationConfig: DynamicFormConfig = {
  fields: [
    // User Information
    {
      name: 'userName',
      label: 'Full Name',
      type: 'text',
      validation: { required: true, minLength: 2 },
    },
    {
      name: 'userEmail',
      label: 'Email Address',
      type: 'email',
      validation: { required: true, email: true },
    },
    {
      name: 'userPassword',
      label: 'Password',
      type: 'password',
      validation: { required: true, minLength: 8 },
    },
    {
      name: 'userPhone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+1 (555) 123-4567',
    },
    
    // Company Information
    {
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
      validation: { required: true, minLength: 2, maxLength: 200 },
    },
    {
      name: 'companyEmail',
      label: 'Company Email',
      type: 'email',
      validation: { required: true, email: true },
    },
    {
      name: 'companyPhone',
      label: 'Company Phone',
      type: 'tel',
      validation: { required: true },
    },
    {
      name: 'street',
      label: 'Street Address',
      type: 'text',
      validation: { required: true },
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      validation: { required: true },
    },
    {
      name: 'state',
      label: 'State/Province',
      type: 'text',
      validation: { required: true },
    },
    {
      name: 'postalCode',
      label: 'Postal Code',
      type: 'text',
      validation: { required: true },
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'mx', label: 'Mexico' },
        // ... more countries
      ],
      validation: { required: true },
    },
    {
      name: 'website',
      label: 'Website',
      type: 'url',
      placeholder: 'https://example.com',
    },
    {
      name: 'industry',
      label: 'Industry',
      type: 'select',
      options: [
        { value: 'tech', label: 'Technology' },
        { value: 'finance', label: 'Finance' },
        { value: 'healthcare', label: 'Healthcare' },
        // ... more industries
      ],
    },
    {
      name: 'description',
      label: 'Company Description',
      type: 'textarea',
      rows: 4,
      helperText: 'Brief description of your company',
    },
  ],
  spacing: 3,
  submitLabel: 'Create Account',
  resetOnSubmit: false,
}

function CompanyRegistrationPage() {
  const [loading, setLoading] = useState(false)
  const [externalErrors, setExternalErrors] = useState({})

  const handleSubmit = async (data: FormData) => {
    setLoading(true)
    setExternalErrors({})

    try {
      // Transform data if needed
      const companyData = {
        user: {
          name: data.userName,
          email: data.userEmail,
          password: data.userPassword,
          phone: data.userPhone,
        },
        company: {
          name: data.companyName,
          email: data.companyEmail,
          phone: data.companyPhone,
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
          },
          website: data.website,
          industry: data.industry,
          description: data.description,
        },
      }

      // API call
      await registerCompany(companyData)
    } catch (error: any) {
      // Handle API errors
      if (error.response?.data?.errors) {
        setExternalErrors(error.response.data.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <DynamicForm
      config={companyRegistrationConfig}
      onSubmit={handleSubmit}
      loading={loading}
      errors={externalErrors}
    />
  )
}
```

## API Reference

### DynamicFormProps

```typescript
interface DynamicFormProps {
  config: DynamicFormConfig          // Form configuration
  onSubmit: (data: FormData) => void // Submit handler
  onChange?: (data: FormData) => void // Change handler (optional)
  initialValues?: FormData           // Initial form values (optional)
  loading?: boolean                  // Loading state (optional)
  errors?: FormErrors                // External errors (optional)
  className?: string                 // CSS class (optional)
}
```

### DynamicFormConfig

```typescript
interface DynamicFormConfig {
  fields: FieldConfig[]              // Array of field configurations
  spacing?: number                   // Grid spacing (default: 3)
  direction?: 'column' | 'row'       // Layout direction (default: 'column')
  submitLabel?: string               // Submit button label (default: 'Submit')
  showSubmitButton?: boolean         // Show submit button (default: true)
  resetOnSubmit?: boolean            // Reset form after submit (default: false)
}
```

## Best Practices

1. **Organize Fields**: Group related fields together in your configuration array
2. **Use Helper Text**: Provide helpful guidance using `helperText` property
3. **Validate Early**: Use built-in validation rules for better UX
4. **Handle External Errors**: Map API errors to field names in the `errors` prop
5. **Transform Data**: Use `onSubmit` to transform form data to your API format
6. **Loading States**: Show loading state during form submission
7. **Initial Values**: Use `initialValues` for edit forms

## TypeScript Support

All types are exported for use in your components:

```typescript
import type {
  DynamicFormConfig,
  FieldConfig,
  FormData,
  FormErrors,
  ValidationRule,
} from '@app/components/DynamicForm'
```
