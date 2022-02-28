/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
import "@nomiclabs/hardhat-ethers";
const { API_URL, PRIVATE_KEY } = process.env;
export const solidity = "0.8.1";
export const defaultNetwork = "ropsten";
export const networks = {
   hardhat: {},
   ropsten: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
   }
};