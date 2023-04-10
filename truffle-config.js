require("babel-register");
require("babel-polyfill");

const HDWalletProvider = require("@truffle/hdwallet-provider");
const appKey = 'https://eth-sepolia.g.alchemy.com/v2/kkI3vJjo67qjvSr9mae7LMwNzbnM0BTs';
const seedPhrase = '815f68611d3d3902add014edd0d2efb9b638aedfbfb3088a3c8945f924967202';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none,
      gas: 99999999
    },
    sepolia: {
      provider: () => new HDWalletProvider(seedPhrase, appKey),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 900000000000000,
      skipDryRun: true,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "petersburg",
    },
  },
  plugins: ["truffle-contract-size"],
};
