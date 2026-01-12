/**
 * Login Form Configuration
 * 
 * Form configuration for user login/sign in
 */

import { DynamicFormConfig } from '@app/components/DynamicForm'

export const loginConfig: DynamicFormConfig = {
  fields: [
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      placeholder: 'tu@ejemplo.com',
      validation: {
        required: true,
        email: true,
      },
      helperText: 'Ingresa tu correo electrónico',
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Ingresa tu contraseña',
      validation: {
        required: true,
      },
      helperText: 'Ingresa tu contraseña',
    },
  ],
  spacing: 3,
  submitLabel: 'Iniciar sesión',
  resetOnSubmit: false,
  showSubmitButton: true,
}
