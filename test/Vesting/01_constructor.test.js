const RaceKingdom = artifacts.require('./RaceKingdom.sol');
const RKVesting = artifacts.require('./RKVesting.sol');
const chalk = require('chalk');
const log = console.log;

contract('RKVesting', (accounts) => {

    // fetch accounts on different index
    let [OWNER, Seed, Private, Public, Team_Operations, Advisors, Play_to_Earn, Staking, Treasury] = accounts;
    let RaceKingdomContract;
    let RKVestingContract;

    beforeEach(async () => {
        log(`
        Contract deployed by ${chalk.yellow.bold('OWNER')}(${chalk.green(OWNER)})          
        ${chalk.yellow.bold('Seed')} Address:-${chalk.green(Seed)}             
        ${chalk.yellow.bold('Private')} Address:-${chalk.green(Private)}           
        ${chalk.yellow.bold('Public')} Address:-${chalk.green(Public)}
        ${chalk.yellow.bold('Team_Operations')} Address:-${chalk.green(Team_Operations)}
        ${chalk.yellow.bold('Advisors')} Address:-${chalk.green(Advisors)}
        ${chalk.yellow.bold('Play_to_Earn')} Address:-${chalk.green(Play_to_Earn)}
        ${chalk.yellow.bold('Staking')} Address:-${chalk.green(Staking)}
        ${chalk.yellow.bold('Treasury')} Address:-${chalk.green(Treasury)}
    `)

        RaceKingdomContract = await RaceKingdom.new(
            Seed,
            Private,
            Public,
            Team_Operations,
            Advisors,
            Play_to_Earn,
            Staking,
            Treasury
        );

        RKVestingContract = await RKVesting.new(
            RaceKingdomContract.address
        );

    })

    it('checking token address --', async () => {

        let token = await RKVestingContract.getToken()
        assert.equal(
            token,
            RaceKingdomContract.address,
            `Invalid token address`
        );

    })
})