/**
 * The « retour » address after signing in comes from the URL (/compte?retour=/produits/nouveau),
 * so anyone can change it. Only addresses inside this site are accepted: "/produits/nouveau"
 * yes; "https://evil.example" or "//evil.example" no (an "open redirect" attack).
 */
export function safeRedirect(target: string | null): string | null {
  if (!target?.startsWith('/') || target.startsWith('//') || target.includes('\\')) return null
  return target
}
