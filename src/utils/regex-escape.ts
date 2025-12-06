const REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g
const ESCAPED_CHARS_PATTERN = /\\([.*+?^${}()|[\]\\])/g

export const regexEscape = (str?: string): string => {
   if (typeof str !== 'string') {
      return ''
   }

   const unescaped = str.replace(ESCAPED_CHARS_PATTERN, '$1')
   return unescaped.replace(REGEX_SPECIAL_CHARS, '\\$&')
}
