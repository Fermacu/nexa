/**
 * DynamicForm Validation
 * 
 * Validation utilities for the dynamic form component
 */

import { ValidationRule } from './types'

/**
 * Validate a single field value against its validation rules
 */
export function validateField(
  value: any,
  rules?: ValidationRule
): string | null {
  if (!rules) return null

  // Required validation
  if (rules.required) {
    if (value === null || value === undefined || value === '') {
      return 'This field is required'
    }
    // For arrays (multiselect), check if empty
    if (Array.isArray(value) && value.length === 0) {
      return 'This field is required'
    }
  }

  // Skip other validations if value is empty (unless required)
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null
  }

  // Email validation
  if (rules.email || rules.pattern) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (rules.email && typeof value === 'string' && !emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return 'Invalid format'
  }

  // String length validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return `Minimum value is ${rules.min}`
    }
    if (rules.max !== undefined && value > rules.max) {
      return `Maximum value is ${rules.max}`
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value)
    if (customError) return customError
  }

  return null
}

/**
 * Validate all fields in a form
 */
export function validateForm(
  data: Record<string, any>,
  fields: Array<{ name: string; validation?: ValidationRule }>
): Record<string, string> {
  const errors: Record<string, string> = {}

  fields.forEach((field) => {
    const value = data[field.name]
    const error = validateField(value, field.validation)
    if (error) {
      errors[field.name] = error
    }
  })

  return errors
}
