import sanitizeHtml from 'sanitize-html';

/**
 * Server-safe HTML sanitization utility
 * Replaces isomorphic-dompurify to avoid jsdom/parse5 ESM compatibility issues
 *
 * Uses sanitize-html's permissive defaults (similar to DOMPurify's USE_PROFILES: { html: true })
 * which allows all safe HTML elements but no SVG or MathML.
 */
export function sanitize(dirty, options = {}) {
  if (!dirty) return '';

  // Use sanitize-html defaults and add img support (img is excluded by default)
  // This matches DOMPurify's USE_PROFILES: { html: true } behavior
  const defaultOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      'img': ['src', 'alt', 'title', 'width', 'height', 'class', 'id'],
      'a': ['href', 'name', 'target', 'class', 'rel'],
      '*': ['class', 'id']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data']
    }
  };

  return sanitizeHtml(dirty, { ...defaultOptions, ...options });
}

export default { sanitize };
