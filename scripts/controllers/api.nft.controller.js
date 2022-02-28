import { join } from 'path'
import fetch from 'node-fetch'
import sizeOf from 'image-size'
import imageType from 'image-type'
import pinataSDK from '@pinata/sdk'
import { createReadStream, readFileSync, writeFile } from 'fs'

import { env_pinata, urls } from '../utils/constants'
import { Contract_Controller } from './api.contract.controller'

const contract_controller = new Contract_Controller()

export class API_NFT_Controller {
  async createNFT(nft_params) {
    const pinata = pinataSDK(
      env_pinata.PINATA_API_KEY,
      env_pinata.PINATA_SECRET,
    )
    const sourcePath = join('assets', 'images', nft_params.file_name)
    const readableStreamForImageFile = createReadStream(sourcePath)
    const imageDimensions = sizeOf(sourcePath)
    const imageDetails = imageType(readFileSync(sourcePath))
    if (await pinata.testAuthentication()) {
      const pinata_result = await pinata.pinFileToIPFS(
        readableStreamForImageFile,
      )
      const imageIpfsHash = pinata_result.IpfsHash
      const PinSize = pinata_result.PinSize
      const imageMetadata = {
        attributes: [
          {
            trait_type: 'Image Type',
            value: imageDetails.mime,
          },
          {
            trait_type: 'Width',
            value: `${imageDimensions.width} pixels`,
          },
          {
            trait_type: 'Height',
            value: `${imageDimensions.height} pixels`,
          },
          {
            trait_type: 'Size',
            value: `${PinSize} bytes`,
          },
        ],
        description: nft_params.description,
        image: `${urls.pinata_static_url}${imageIpfsHash}`,
        name: nft_params.name,
      }
      const metadata_file_path = join(
        'assets',
        'json',
        `${imageIpfsHash}-metadata.json`,
      )
      writeFile(
        metadata_file_path,
        JSON.stringify(imageMetadata),
        (err) => {
          if (err) {
            console.error(err)
            return
          }
        },
      )
      const readableStreamForJSONSONFile = createReadStream(metadata_file_path)
      const result = await pinata.pinFileToIPFS(readableStreamForJSONSONFile)
      const transactionData = await contract_controller.mintNFT(
        `${urls.pinata_static_url}${result.IpfsHash}`,
      )
      return transactionData
    }
    return {}
  }

  async getTokenImageDetails(tokenId) {
    const tokenUri = await contract_controller.getTokenUri(tokenId)
    const response = await fetch(tokenUri.tokenURI)
    const imageDetails = await response.json()
    return imageDetails
  }

  async isTransactionConfirmed(txHash) {
    const confirmationDetails = await contract_controller.isTransactionConfirmed(
      txHash,
    )
    return {
      isConfirmed: confirmationDetails.isConfirmed,
      numConfirmed: confirmationDetails.isConfirmed
        ? confirmationDetails.numConfirmed
        : 0,
    }
  }
}
