import { Router } from 'express'

const router = Router()

import nft_routes from './api.nft.routes'

nft_routes.NFT_Routes(router)

export default router
