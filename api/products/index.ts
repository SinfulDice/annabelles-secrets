// GET /api/products (R17). Vercel turns each file of api/ into an address; the code is shared.
import { handleApiRequest } from '../../server/routes'

// "edge": Vercel bundles this file with everything it imports (server/, src/utils/, the JSON).
export const config = { runtime: 'edge' }

export default handleApiRequest
