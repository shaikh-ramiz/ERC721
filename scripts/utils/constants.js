import { config } from 'dotenv'

config()

export const env_ropsten = {
  API_URL: process.env.API_URL,
}

export const env_pinata = {
  PINATA_SECRET: process.env.PINATA_SECRET,
  PINATA_API_KEY: process.env.PINATA_API_KEY,
}

export const urls = {
  pinata_static_url: 'https://gateway.pinata.cloud/ipfs/',
}

export const env_contract_address = {
  erc721contractAddress: process.env.ERC721_CONTRACT_ADDRESS,
}

export const env_blockchain = {
  PUBLIC_KEY: process.env.PUBLIC_KEY,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
}

export const blockchain_params = {
  gas: 500000,
}
