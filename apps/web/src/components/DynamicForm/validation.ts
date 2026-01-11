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
      return 'Este campo es requerido'
    }
    // For arrays (multiselect), check if empty
    if (Array.isArray(value) && value.length === 0) {
      return 'Este campo es requerido'
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
      return 'Por favor ingresa un correo electrónico válido'
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return 'Formato inválido'
  }

  // String length validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `La longitud mínima es ${rules.minLength} caracteres`
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `La longitud máxima es ${rules.maxLength} caracteres`
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return `El valor mínimo es ${rules.min}`
    }
    if (rules.max !== undefined && value > rules.max) {
      return `El valor máximo es ${rules.max}`
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
