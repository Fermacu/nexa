/**
 * Company Edit Form Configuration
 * 
 * Form configuration for editing company information.
 * Used in the edit drawer for administrators.
 */

import { DynamicFormConfig } from '@app/components/DynamicForm'
import {
  getCompanyFormFields,
  transformCompanyToFormData,
  transformFormDataToCompany,
} from '@app/config/companyFormFields'

export const companyEditConfig: DynamicFormConfig = {
  fields: getCompanyFormFields(),
  spacing: 3,
  submitLabel: 'Guardar cambios',
  resetOnSubmit: false,
  showSubmitButton: true,
}

// Re-export transformation functions for convenience
export { transformCompanyToFormData, transformFormDataToCompany }
