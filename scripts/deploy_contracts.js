async function main() {
  const NFT_ERC721 = await ethers.getContractFactory('NFT_ERC721')
  const NFT_ERC721_Contract = await NFT_ERC721.deploy()
  await NFT_ERC721_Contract.deployed()
  console.log('Contract deployed to address:', NFT_ERC721_Contract.address)
}

await main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
