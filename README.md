# Pre-requisite
1) Node.js
    Download and install Node.js from https://nodejs.org/en/
2) Truffle
    Install truffle via npm
    **npm install -g truffle**
3) Ganache-cli
    Install ganache-cli via npm
    **npm install -g ganache-cli**

# Setup
Clone the project and install the components
  **npm install**

# Contracts Migration
1) Setup .env file (get example from envExample.txt) and set
   - Deployer_Primary_key, 
   - Provider, 
   - Etherscan_Key or Bscscan_Key,
   - Seed,
   - Private,
   - Public
   - Team_Operations
   - Advisors
   - Play_to_Earn
   - Staking
   - Treasury 
2) Make build run
   **truffle build**
3) Start migration to ganache run
   **npx truffle console**
             or
   Start migration to ethMainNet run
   **npx truffle console --network ethMainNet**
               or
   Start migration to bscMainNet run
   **npx truffle console --network bscMainNet**            
4) After connecting to network run
   **migrate**
5) Verifying contract on etherscan(choose network accordingly) run
   **truffle run verify RaceKingdom@Contract_Address --network rinkeby**

# Contracts test 
1) Setup env file like mention above
2) Open a new terminal and start ganache-cli
    **ganache-cli**
3) Open a new terminal and execute test script
    **truffle test**

