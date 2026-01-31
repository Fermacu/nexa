/**
 * Shared Company Form Fields Configuration
 * 
 * This file contains the shared field definitions for company forms.
 * Used by both registration and edit forms to ensure consistency.
 */

import { FieldConfig } from '@app/components/DynamicForm'
import { COUNTRIES, INDUSTRIES } from '@app/constants'

/**
 * Get company form fields configuration
 * These fields are shared between registration and edit forms
 */
export function getCompanyFormFields(): FieldConfig[] {
  return [
    {
      name: 'companyName',
      label: 'Nombre de la empresa',
      type: 'text',
      placeholder: 'Ingresa el nombre de tu empresa',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 200,
      },
      helperText: 'Nombre oficial de la empresa',
    },
    {
      name: 'companyEmail',
      label: 'Correo electrónico de la empresa',
      type: 'email',
      placeholder: 'contacto@empresa.com',
      validation: {
        required: true,
        email: true,
      },
      helperText: 'Correo electrónico corporativo',
    },
    {
      name: 'companyPhone',
      label: 'Teléfono de la empresa',
      type: 'tel',
      placeholder: '+1 (555) 123-4567',
      validation: {
        required: true,
      },
      helperText: 'Teléfono principal de la empresa',
    },
    {
      name: 'street',
      label: 'Dirección',
      type: 'text',
      placeholder: '123 Calle Principal',
      validation: {
        required: true,
        minLength: 3,
        maxLength: 200,
      },
    },
    {
      name: 'city',
      label: 'Ciudad',
      type: 'text',
      placeholder: 'Ciudad de México',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
    {
      name: 'state',
      label: 'Estado / Provincia',
      type: 'text',
      placeholder: 'Ciudad de México',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
    {
      name: 'postalCode',
      label: 'Código postal',
      type: 'text',
      placeholder: '01234',
      validation: {
        required: true,
        minLength: 3,
        maxLength: 20,
      },
    },
    {
      name: 'country',
      label: 'País',
      type: 'select',
      options: [{ value: '', label: 'Selecciona un país' }, ...COUNTRIES],
      validation: {
        required: true,
      },
    },
    {
      name: 'website',
      label: 'Sitio web',
      type: 'url',
      placeholder: 'https://www.empresa.com',
      validation: {
        required: false,
        custom: (value: any) => {
          if (!value) return null
          try {
            new URL(value)
            return null
          } catch {
            return 'Por favor ingresa una URL válida'
          }
        },
      },
      helperText: 'Sitio web de la empresa (opcional)',
    },
    {
      name: 'industry',
      label: 'Industria',
      type: 'select',
      options: INDUSTRIES,
      validation: {
        required: false,
      },
      helperText: 'Opcional, nos ayuda a personalizar tu experiencia',
    },
    {
      name: 'description',
      label: 'Descripción de la empresa',
      type: 'textarea',
      rows: 4,
      placeholder: 'Breve descripción de tu empresa...',
      validation: {
        required: false,
        maxLength: 500,
      },
      helperText: 'Descripción breve opcional (máximo 500 caracteres)',
    },
  ]
}

/**
 * Transform company data to form format
 */
export function transformCompanyToFormData(company: {
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  website?: string
  description?: string
  industry?: string
}) {
  return {
    companyName: company.name,
    companyEmail: company.email,
    companyPhone: company.phone,
    street: company.address.street,
    city: company.address.city,
    state: company.address.state,
    postalCode: company.address.postalCode,
    country: company.address.country,
    website: company.website || '',
    industry: company.industry || '',
    description: company.description || '',
  }
}

/**
 * Transform form data to company update format
 */
export function transformFormDataToCompany(formData: Record<string, any>) {
  return {
    name: formData.companyName,
    email: formData.companyEmail,
    phone: formData.companyPhone,
    address: {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
    },
    website: formData.website || undefined,
    industry: formData.industry || undefined,
    description: formData.description || undefined,
  }
}
