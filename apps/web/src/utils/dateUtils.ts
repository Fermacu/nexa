/**
 * Date Utility Functions
 * 
 * Helper functions for date formatting and manipulation
 */

const DEFAULT_LOCALE = 'es-ES'

/**
 * Format a date string to a localized date format
 */
export function formatDate(dateString: string, locale: string = DEFAULT_LOCALE): string {
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
