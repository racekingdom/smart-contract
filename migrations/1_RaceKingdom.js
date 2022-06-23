const RaceKingdom = artifacts.require('./RaceKingdom');
const RKVesting = artifacts.require('./RKVesting');
require('dotenv').config();

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

