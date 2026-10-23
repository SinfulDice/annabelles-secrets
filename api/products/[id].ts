// GET /api/products/:id (R18). [id] in the file name = any value in that part of the address.
import { handleApiRequest } from '../../server/routes'

export const config = { runtime: 'edge' }

export default handleApiRequest
