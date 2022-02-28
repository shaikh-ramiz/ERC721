import { createAlchemyWeb3 } from '@alch/alchemy-web3'

import {
  env_ropsten,
  env_contract_address,
  env_blockchain,
  blockchain_params,
} from '../utils/constants'
import contract from '../../artifacts/contracts/NFT_ERC721.sol/NFT_ERC721.json'

export class Contract_Controller {
  web3 = createAlchemyWeb3(env_ropsten.API_URL)
  nftContract = new this.web3.eth.Contract(
    contract.abi,
    env_contract_address.erc721contractAddress,
  )

  async mintNFT(tokenURI) {
    const nonce = await this.web3.eth.getTransactionCount(
      env_blockchain.PUBLIC_KEY,
      'latest',
    )
    const tx = {
      from: env_blockchain.PUBLIC_KEY,
      to: env_contract_address.erc721contractAddress,
      nonce: nonce,
      gas: blockchain_params.gas,
      data: await this.nftContract.methods
        .mintNFT(env_blockchain.PUBLIC_KEY, tokenURI)
        .encodeABI(),
    }
    const signedTx = await this.web3.eth.accounts.signTransaction(
      tx,
      env_blockchain.PRIVATE_KEY,
    )
    const transactionDetails = await this.web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )
    let eventDetails = []
    const txDetails = await this.web3.eth.getTransaction(transactionDetails.transactionHash)
    const events = await this.nftContract.getPastEvents('Transfer', {
      filter: { nonce: txDetails.nonce },
      fromBlock: txDetails.blockNumber,
    })
    const eventObj = JSON.parse(JSON.stringify(events))
    const eventKeys = Object.keys(eventObj)
    eventKeys.forEach(function (key) {
      eventDetails = eventObj[key].returnValues
    })
    return { tokenId: eventDetails.tokenId, transactionHash: transactionDetails.transactionHash }
  }

  async getTokenUri(tokenId) {
    const tokenUri = await await this.nftContract.methods
      .tokenURI(tokenId)
      .call()
    return { tokenURI: tokenUri }
  }

  async isTransactionConfirmed(transactionHash) {
    const txDetails = await this.web3.eth.getTransaction(transactionHash)
    const latestBlockNumber = await this.web3.eth.getBlockNumber()
    const numConfirmed = latestBlockNumber - txDetails.blockNumber
    return numConfirmed >= 5
      ? { isConfirmed: true, numConfirmed: numConfirmed }
      : { isConfirmed: false }
  }
}
