/**
 * Registration Form Configuration
 * 
 * Form configuration for user registration only.
 * Users can create organizations later from their profile.
 */

import { DynamicFormConfig } from '@app/components/DynamicForm'

export const registrationConfig: DynamicFormConfig = {
  fields: [
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
        custom: (value: any) => {
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
  }
}
