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
import { FieldConfig, DynamicFormProps, FormData, FormErrors } from './types'
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

  // Update form data when initialValues change
  useEffect(() => {
    setFormData(initialValues)
  }, [initialValues])

  // Update errors when externalErrors change
  useEffect(() => {
    if (Object.keys(externalErrors).length > 0) {
      setErrors(externalErrors)
    }
  }, [externalErrors])

  // Handle field value change
  const handleChange = useCallback(
    (fieldName: string, value: any) => {
      const newData = { ...formData, [fieldName]: value }
      setFormData(newData)

      // Validate field
      const field = config.fields.find((f) => f.name === fieldName)
      if (field?.validation) {
        const error = validateField(value, field.validation)
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error || '',
        }))
      } else {
        // Clear error for this field
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[fieldName]
          return newErrors
        })
      }

      // Call onChange callback
      if (onChange) {
        onChange(newData)
      }
    },
    [formData, config.fields, onChange]
  )

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate all fields
      const validationErrors = validateForm(formData, config.fields)
      setErrors(validationErrors)

      // If there are errors, don't submit
      if (Object.keys(validationErrors).length > 0) {
        return
      }

      // Call onSubmit
      await onSubmit(formData)

      // Reset form if configured
      if (config.resetOnSubmit) {
        setFormData(initialValues)
        setErrors({})
      }
    },
    [formData, config, onSubmit, initialValues]
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
          error={!!errors[field.name]}
          helperText={errors[field.name] || field.helperText}
          disabled={field.disabled || loading}
          fullWidth={field.fullWidth !== false}
          multiline
          rows={field.rows || 4}
          required={field.validation?.required}
        />
      )
    }

    const inputType =
      field.type === 'email'
        ? 'email'
        : field.type === 'password'
        ? 'password'
        : field.type === 'tel'
        ? 'tel'
        : field.type === 'url'
        ? 'url'
        : field.type === 'number'
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
            field.type === 'number' ? Number(e.target.value) : e.target.value
          )
        }
        error={!!errors[field.name]}
        helperText={errors[field.name] || field.helperText}
        disabled={field.disabled || loading}
        fullWidth={field.fullWidth !== false}
        multiline={field.multiline}
        rows={field.rows}
        required={field.validation?.required}
        InputProps={field.inputProps}
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
        error={!!errors[field.name]}
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
        {(errors[field.name] || field.helperText) && (
          <FormHelperText>
            {errors[field.name] || field.helperText}
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
        error={!!errors[field.name]}
        helperText={errors[field.name] || field.helperText}
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
          <Grid item xs={12} key={field.name}>
            {renderField(field)}
          </Grid>
        ))}

        {config.showSubmitButton !== false && (
          <Grid item xs={12}>
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
