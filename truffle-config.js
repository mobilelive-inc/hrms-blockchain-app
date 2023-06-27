require("babel-register");
require("babel-polyfill");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const appKey = 'https://eth-sepolia.g.alchemy.com/v2/kkI3vJjo67qjvSr9mae7LMwNzbnM0BTs';
const seedPhrase = 'bf3ecf767dd75f51cecdc96f164ed771f53944c997bfc9c78d00748159b909ae';
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gas: 6721975
    },
    sepolia: {
      provider: () => new HDWalletProvider(seedPhrase, appKey),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 99999999999999,
      skipDryRun: true
    },
    loc_development_development: {
      network_id: "*",
      port: 8545,
      host: "127.0.0.1"
    }
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  },
  plugins: ["truffle-contract-size"]
};
