/**
 * Company Registration Form Configuration
 * 
 * Form configuration for company registration based on company-structure.md
 * This follows modern SaaS standards for user and company onboarding.
 */

import { DynamicFormConfig } from '@app/components/DynamicForm'
import { COUNTRIES, INDUSTRIES } from '@app/constants'

export const companyRegistrationConfig: DynamicFormConfig = {
  fields: [
    // Section: Creator User Information
    {
      name: 'userName',
      label: 'Nombre completo',
      type: 'text',
      placeholder: 'Ingresa tu nombre completo',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      helperText: 'Este será el nombre de tu cuenta',
    },
    {
      name: 'userEmail',
      label: 'Correo electrónico',
      type: 'email',
      placeholder: 'tu@ejemplo.com',
      validation: {
        required: true,
        email: true,
      },
      helperText: 'Se usará para iniciar sesión y verificación de cuenta',
    },
    {
      name: 'userPassword',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Crea una contraseña segura',
      validation: {
        required: true,
        minLength: 8,
        custom: (value) => {
          if (!value) return null
          const hasUpperCase = /[A-Z]/.test(value)
          const hasLowerCase = /[a-z]/.test(value)
          const hasNumber = /\d/.test(value)
          if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            return 'La contraseña debe contener mayúsculas, minúsculas y números'
          }
          return null
        },
      },
      helperText: 'Mínimo 8 caracteres con mayúsculas, minúsculas y números',
    },
    {
      name: 'userPhone',
      label: 'Número de teléfono',
      type: 'tel',
      placeholder: '+1 (555) 123-4567',
      validation: {
        required: false,
      },
      helperText: 'Opcional, se usa para recuperación de cuenta',
    },

    // Section: Company Information
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

    // Section: Company Address
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
      options: COUNTRIES,
      validation: {
        required: true,
      },
    },

    // Section: Optional Company Information
    {
      name: 'website',
      label: 'Sitio web',
      type: 'url',
      placeholder: 'https://www.empresa.com',
      validation: {
        required: false,
        custom: (value) => {
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
  ],
  spacing: 3,
  submitLabel: 'Crear cuenta',
  resetOnSubmit: false,
  showSubmitButton: true,
}

/**
 * Transform form data to API format
 */
export function transformRegistrationData(formData: Record<string, any>) {
  return {
    user: {
      name: formData.userName,
      email: formData.userEmail,
      password: formData.userPassword,
      phone: formData.userPhone || undefined,
    },
    company: {
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
    },
  }
}
