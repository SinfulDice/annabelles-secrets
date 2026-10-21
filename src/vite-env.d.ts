/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRODUCTS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
