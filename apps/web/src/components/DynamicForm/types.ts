/**
 * DynamicForm Types
 * 
 * Type definitions for the dynamic form component that supports
 * various Material-UI form fields in a reusable way.
 */

import { TextFieldProps, SelectProps, FormControlProps } from '@mui/material'

/**
 * Supported field types in the dynamic form
 */
export type FieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'checkbox'

/**
 * Validation rule for a form field
 */
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => string | null // Returns error message or null if valid
  email?: boolean
}

/**
 * Select option for select/multiselect fields
 */
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

/**
 * Base field configuration
 */
export interface BaseFieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  helperText?: string
  disabled?: boolean
  validation?: ValidationRule
  fullWidth?: boolean
  defaultValue?: any
}

/**
 * Text-based field configuration (text, email, password, etc.)
 */
export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  multiline?: boolean
  rows?: number
  inputProps?: TextFieldProps['InputProps']
}

/**
 * Textarea field configuration
 */
export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea'
  rows?: number
  minRows?: number
  maxRows?: number
}

/**
 * Select field configuration
 */
export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select'
  options: SelectOption[]
  multiple?: false
}

/**
 * Multi-select field configuration
 */
export interface MultiSelectFieldConfig extends BaseFieldConfig {
  type: 'multiselect'
  options: SelectOption[]
  multiple: true
}

/**
 * Date field configuration
 */
export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date'
  minDate?: Date | string
  maxDate?: Date | string
}

/**
 * Checkbox field configuration
 */
export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox'
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom'
}

/**
 * Union type for all field configurations
 */
export type FieldConfig = 
  | TextFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | MultiSelectFieldConfig
  | DateFieldConfig
  | CheckboxFieldConfig

/**
 * Complete form configuration
 */
export interface DynamicFormConfig {
  fields: FieldConfig[]
  spacing?: number // Grid spacing between fields
  direction?: 'column' | 'row'
  submitLabel?: string
  showSubmitButton?: boolean
  resetOnSubmit?: boolean
}

/**
 * Form data object (key-value pairs)
 */
export type FormData = Record<string, any>

/**
 * Form errors object
 */
export type FormErrors = Record<string, string>

/**
 * Props for the DynamicForm component
 */
export interface DynamicFormProps {
  config: DynamicFormConfig
  onSubmit: (data: FormData) => void | Promise<void>
  onChange?: (data: FormData) => void
  initialValues?: FormData
  loading?: boolean
  errors?: FormErrors // External errors (e.g., from API)
  className?: string
}
