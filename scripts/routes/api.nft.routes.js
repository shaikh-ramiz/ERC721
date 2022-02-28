import { API_NFT_Controller } from '../controllers/api.nft.controller'

const nft_controller = new API_NFT_Controller()

const NFT_Routes = (nft_router) => {
  nft_router.post('/addfile', async (req, res) => {
    const transactionDetails = await nft_controller.createNFT(req.body)
    res.status(201)
    return res.json({ transactionDetails: transactionDetails })
  })

  nft_router.get('/getTokenImageDetails', async (req, res) => {
    const imageDetails = await nft_controller.getTokenImageDetails(
      req.query.tokenId,
    )
    res.json({ imageDetails: imageDetails })
  })

  nft_router.get('/isTransactionConfirmed', async (req, res) => {
    const confirmationDetails = await nft_controller.isTransactionConfirmed(
      req.query.txHash,
    )
    res.json({ confirmationDetails: confirmationDetails })
  })
}

export default {
  NFT_Routes,
}
