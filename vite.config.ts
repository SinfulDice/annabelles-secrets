import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

type ApiRoutes = typeof import('./server/routes')

/**
 * In `npm run dev` there is no Vercel: this small plugin answers the /api/… addresses with the
 * same function as in production (R10). The server code is loaded by Vite itself
 * (ssrLoadModule), so editing server/ takes effect without restarting `npm run dev`.
 */
function apiDevServer(): Plugin {
  return {
    name: 'annabelle-api',
    configureServer(server) {
      // A "middleware": it sees every request before Vite, and lets the others through (next).
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          next()
          return
        }
        const url = new URL(req.url, 'http://localhost')
        server
          .ssrLoadModule('/server/routes.ts')
          .then(async (module) => {
            const { handleApiRequest } = module as ApiRoutes
            // Node's request → standard Request; standard Response → Node's response (res).
            const response = handleApiRequest(new Request(url, { method: req.method }))
            res.statusCode = response.status
            response.headers.forEach((value, name) => res.setHeader(name, value))
            res.end(await response.text())
          })
          .catch(next)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevServer()],
  test: {
    include: ['src/**/*.test.ts', 'server/**/*.test.ts'],
  },
})
