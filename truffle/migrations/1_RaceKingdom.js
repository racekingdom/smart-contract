const RaceKingdom = artifacts.require('./RaceKingdom');
const RKVesting = artifacts.require('./RKVesting');
const path = require('path');
require('dotenv').config();
const filePath = path.join(__dirname, '../.env');
require('dotenv').config({ path: filePath });

module.exports = async function (deployer) {

  await deployer.deploy(
    RaceKingdom,
    process.env.Seed,
    process.env.Private,
    process.env.Public,
    process.env.Team_Operations,
    process.env.Advisors,
    process.env.Play_to_Earn,
    process.env.Staking,
    process.env.Treasury,
    );

  let raceKingdomDeployed = await RaceKingdom.deployed();
  await deployer.deploy(
    RKVesting,
    raceKingdomDeployed.address
    );
  await RKVesting.deployed();

};

