/**
 * Industries Constants
 * 
 * List of industries for use in forms and dropdowns.
 * Format: { value: string, label: string }
 */

export interface IndustryOption {
  value: string
  label: string
}

export const INDUSTRIES: IndustryOption[] = [
  { value: 'technology', label: 'Tecnología' },
  { value: 'finance', label: 'Finanzas' },
  { value: 'healthcare', label: 'Salud' },
  { value: 'education', label: 'Educación' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufactura' },
  { value: 'consulting', label: 'Consultoría' },
  { value: 'legal', label: 'Legal' },
  { value: 'real-estate', label: 'Bienes raíces' },
  { value: 'hospitality', label: 'Hospitalidad' },
  { value: 'transportation', label: 'Transporte' },
  { value: 'energy', label: 'Energía' },
  { value: 'media', label: 'Medios y entretenimiento' },
  { value: 'nonprofit', label: 'Sin fines de lucro' },
  { value: 'other', label: 'Otra' },
]
