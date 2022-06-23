/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */
 require('dotenv').config();
 const HDWalletProvider = require('@truffle/hdwallet-provider');
 
 module.exports = {
 
     networks: {
 
         development: {
             host: '127.0.0.1',
             port: 7545,
             network_id: 5777,
         },
         rinkeby: {
             provider: () =>
                 new HDWalletProvider(
                     `${process.env.Deployer_Primary_key}`,
                     `${process.env.Provider}`
                 ),
             network_id: 4,
             gas: 7500000,
             confirmations: 2,
             timeoutBlocks: 200,
             skipDryRun: true,
         },
         ethMainNet: {
             provider: () =>
                 new HDWalletProvider(
                     `${process.env.Deployer_Primary_key}`,
                     `${process.env.Provider}`
                 ),
             network_id: 1,
             gas: 7500000,
             confirmations: 2,
             timeoutBlocks: 200,
             skipDryRun: true,
         },
         bscTestNet: {
             provider: () =>
                 new HDWalletProvider(
                     `${process.env.Deployer_Primary_key}`,
                     `${process.env.Provider}`
                 ),
             network_id: 97,
             confirmations: 10,
             timeoutBlocks: 200,
             skipDryRun: true
         },
         bscMainNet: {
             provider: () =>
                 new HDWalletProvider(
                     `${process.env.Deployer_Primary_key}`,
                     `${process.env.Provider}`
                 ),
             network_id: 56,
             confirmations: 10,
             timeoutBlocks: 200,
             skipDryRun: true
         },
     },
     plugins: ['truffle-plugin-verify'],
     api_keys: {
         etherscan: `${process.env.Etherscan_Key}`,
         bscscan: `${process.env.Bscscan_Key}`,
     },
     // Configure your compilers
     compilers: {
         solc: {
             version: '0.8.14',
             settings: {
                 optimizer: {
                     enabled: true,
                     runs: 200
                 },
                 evmVersion: "byzantium"
             }
         },
     },
 };