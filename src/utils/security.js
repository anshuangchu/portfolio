/**
 * Strip HTML tags to prevent XSS injection.
 */
export function sanitizeHtml(input) {
  if (!input || typeof input !== 'string') return ''
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

/**
 * Validate that a URL is safe (no javascript:, data:, or other dangerous schemes).
 */
export function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url, window.location.origin)
    const allowed = ['http:', 'https:', 'mailto:', 'tel:']
    return allowed.includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Return a sanitized URL or an empty string if unsafe.
 */
export function sanitizeUrl(url) {
  return isSafeUrl(url) ? url : ''
}

/**
 * Security attributes for external links.
 */
export const externalLinkAttrs = {
  rel: 'noopener noreferrer',
  target: '_blank',
}
