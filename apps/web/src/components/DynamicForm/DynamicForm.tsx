'use client'

/**
 * DynamicForm Component
 * 
 * A flexible, reusable form component that generates form fields
 * based on a configuration object. Supports various Material-UI
 * field types including text, select, multiselect, textarea, etc.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  OutlinedInput,
} from '@mui/material'
import { FieldConfig, DynamicFormProps, FormData, FormErrors, TextFieldConfig } from './types'
import { validateField, validateForm } from './validation'

export function DynamicForm({
  config,
  onSubmit,
  onChange,
  initialValues = {},
  loading = false,
  errors: externalErrors = {},
  className,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<FormData>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Update errors when externalErrors change (only for touched fields)
  useEffect(() => {
    const touchedErrors: FormErrors = {}
    Object.keys(externalErrors).forEach((key) => {
      if (touched[key] && externalErrors[key]) {
        touchedErrors[key] = externalErrors[key]
      }
    })
    setErrors((prevErrors) => ({ ...prevErrors, ...touchedErrors }))
  }, [externalErrors, touched])

  // Handle field value change
  const handleChange = useCallback(
    (fieldName: string, value: unknown) => {
      // Mark field as touched
      setTouched((prevTouched) => ({ ...prevTouched, [fieldName]: true }))

      // Calculate new data using current formData
      setFormData((prevFormData) => {
        const newData = { ...prevFormData, [fieldName]: value }

        // Validate field (only show errors for touched fields)
        const field = config.fields.find((f) => f.name === fieldName)
        if (field?.validation) {
          const error = validateField(value, field.validation)
          setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: error || '',
          }))
        } else {
          // Clear error for this field
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors }
            delete newErrors[fieldName]
            return newErrors
          })
        }

        // Call onChange callback
        if (onChange) {
          onChange(newData)
        }

        return newData
      })
    },
    [config.fields, onChange]
  )

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {}
      config.fields.forEach((field) => {
        allTouched[field.name] = true
      })
      setTouched(allTouched)

      // Validate all fields
      const validationErrors = validateForm(formData, config.fields)
      setErrors(validationErrors)

      // If there are errors, don't submit
      if (Object.keys(validationErrors).length > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[DynamicForm] Envío bloqueado por validación:', validationErrors)
        }
        return
      }

      // Call onSubmit
      await onSubmit(formData)

      // Reset form if configured
      if (config.resetOnSubmit) {
        setFormData(initialValues)
        setErrors({})
        setTouched({})
      }
    },
    [formData, config.fields, config.resetOnSubmit, initialValues, onSubmit]
  )

  // Render a text field
  const renderTextField = (field: FieldConfig) => {
    if (field.type === 'textarea') {
      return (
        <TextField
          key={field.name}
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          value={formData[field.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
          error={!!(touched[field.name] && errors[field.name])}
          helperText={touched[field.name] ? (errors[field.name] || field.helperText) : field.helperText}
          disabled={field.disabled || loading}
          fullWidth={field.fullWidth !== false}
          multiline
          rows={field.type === 'textarea' ? (field.rows || 4) : undefined}
          required={field.validation?.required}
        />
      )
    }

    const textFieldTypes = ['text', 'email', 'password', 'number', 'tel', 'url']
    if (!textFieldTypes.includes(field.type)) {
      return null
    }

    const textField = field as TextFieldConfig

    const inputType =
      textField.type === 'email'
        ? 'email'
        : textField.type === 'password'
        ? 'password'
        : textField.type === 'tel'
        ? 'tel'
        : textField.type === 'url'
        ? 'url'
        : textField.type === 'number'
        ? 'number'
        : 'text'

    return (
      <TextField
        key={field.name}
        name={field.name}
        type={inputType}
        label={field.label}
        placeholder={field.placeholder}
        value={formData[field.name] || ''}
        onChange={(e) =>
          handleChange(
            field.name,
            textField.type === 'number' ? Number(e.target.value) : e.target.value
          )
        }
        error={!!(touched[field.name] && errors[field.name])}
        helperText={touched[field.name] ? (errors[field.name] || field.helperText) : field.helperText}
        disabled={field.disabled || loading}
        fullWidth={field.fullWidth !== false}
        multiline={textField.multiline}
        rows={textField.rows}
        required={field.validation?.required}
        InputProps={textField.inputProps}
      />
    )
  }

  // Render a select field
  const renderSelectField = (field: FieldConfig) => {
    if (field.type !== 'select' && field.type !== 'multiselect') return null

    const isMultiple = field.type === 'multiselect'
    const value = formData[field.name] || (isMultiple ? [] : '')

    return (
      <FormControl
        key={field.name}
        fullWidth={field.fullWidth !== false}
        error={!!(touched[field.name] && errors[field.name])}
        disabled={field.disabled || loading}
        required={field.validation?.required}
      >
        <InputLabel>{field.label}</InputLabel>
        <Select
          name={field.name}
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          multiple={isMultiple}
          input={<OutlinedInput label={field.label} />}
        >
          {field.options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {(touched[field.name] ? (errors[field.name] || field.helperText) : field.helperText) && (
          <FormHelperText>
            {touched[field.name] ? (errors[field.name] || field.helperText) : field.helperText}
          </FormHelperText>
        )}
      </FormControl>
    )
  }

  // Render a date field
  const renderDateField = (field: FieldConfig) => {
    if (field.type !== 'date') return null

    return (
      <TextField
        key={field.name}
        name={field.name}
        type="date"
        label={field.label}
        value={formData[field.name] || ''}
        onChange={(e) => handleChange(field.name, e.target.value)}
        error={!!(touched[field.name] && errors[field.name])}
        helperText={touched[field.name] ? (errors[field.name] || field.helperText) : field.helperText}
        disabled={field.disabled || loading}
        fullWidth={field.fullWidth !== false}
        required={field.validation?.required}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: field.minDate,
          max: field.maxDate,
        }}
      />
    )
  }

  // Render a checkbox field
  const renderCheckboxField = (field: FieldConfig) => {
    if (field.type !== 'checkbox') return null

    return (
      <FormControlLabel
        key={field.name}
        control={
          <Checkbox
            name={field.name}
            checked={!!formData[field.name]}
            onChange={(e) => handleChange(field.name, e.target.checked)}
            disabled={field.disabled || loading}
            required={field.validation?.required}
          />
        }
        label={field.label}
        labelPlacement={field.labelPlacement || 'end'}
      />
    )
  }

  // Render a field based on its type
  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
      case 'textarea':
        return renderTextField(field)

      case 'select':
      case 'multiselect':
        return renderSelectField(field)

      case 'date':
        return renderDateField(field)

      case 'checkbox':
        return renderCheckboxField(field)

      default:
        return null
    }
  }

  const spacing = config.spacing ?? 3
  const direction = config.direction ?? 'column'

  return (
    <Box component="form" onSubmit={handleSubmit} className={className}>
      <Grid container spacing={spacing} direction={direction}>
        {config.fields.map((field) => (
          <Grid size={{ xs: 12 }} key={field.name}>
            {renderField(field)}
          </Grid>
        ))}

        {config.showSubmitButton !== false && (
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {config.submitLabel || 'Submit'}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
