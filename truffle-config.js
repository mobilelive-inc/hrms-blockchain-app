require("babel-register");
require("babel-polyfill");

const HDWalletProvider = require("@truffle/hdwallet-provider");
const appKey = 'https://eth-sepolia.g.alchemy.com/v2/OeRJO2_DW04UdvAGy8bocQkMSplRxswm';
const seedPhrase = 'b1dd05c60abc058af36165b6576fab6b96ac3cbe709cdb3d1cacbed51a07c712';

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
