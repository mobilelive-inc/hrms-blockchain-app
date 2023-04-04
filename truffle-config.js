require("babel-register");
require("babel-polyfill");

const HDWalletProvider = require("@truffle/hdwallet-provider");
const appKey = 'https://eth-goerli.g.alchemy.com/v2/MqnpdqPAQguvOp_t6OjUCLd9msANy1Jj';
// const appKey = 'https://eth-sepolia.g.alchemy.com/v2/kkI3vJjo67qjvSr9mae7LMwNzbnM0BTs';
const seedPhrase = '815f68611d3d3902add014edd0d2efb9b638aedfbfb3088a3c8945f924967202';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none,
    },
    sepolia: {
      provider: () => new HDWalletProvider(seedPhrase, appKey),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 9999999999999,
      skipDryRun: true,
      networkCheckTimeout: 999999
    },
    goerli: {
      provider: () => new HDWalletProvider(seedPhrase, appKey),
      network_id: 5,
      gas: 8000000,
      confirmations: 2,
      timeoutBlocks: 900000000000000,
      skipDryRun: true,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "petersburg",
    },
  },
  plugins: ["truffle-contract-size"],
};
