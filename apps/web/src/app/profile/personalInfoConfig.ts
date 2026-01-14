/**
 * Personal Information Edit Form Configuration
 * 
 * Form configuration for editing user personal information.
 * Used in the edit drawer in the profile page.
 */

import { DynamicFormConfig } from '@app/components/DynamicForm'

export const personalInfoConfig: DynamicFormConfig = {
  fields: [
    {
      name: 'name',
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
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      placeholder: 'tu@ejemplo.com',
      validation: {
        required: true,
        email: true,
      },
      helperText: 'Este correo se usa para iniciar sesión',
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'tel',
      placeholder: '+1 (555) 123-4567',
      validation: {
        required: false,
      },
      helperText: 'Opcional, se usa para recuperación de cuenta',
    },
  ],
  spacing: 3,
  submitLabel: 'Guardar cambios',
  resetOnSubmit: false,
  showSubmitButton: true,
}

/**
 * Transform user data to form format
 */
export function transformUserToFormData(user: {
  name: string
  email: string
  phone?: string
}) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  }
}
