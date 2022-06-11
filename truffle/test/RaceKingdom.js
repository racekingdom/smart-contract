const RaceKingdom = artifacts.require('./RaceKingdom.sol');
require('dotenv').config();
const chalk = require('chalk');
const log = console.log;
const multiplier = 1e18

contract('RaceKingdom', (accounts) => {

    // fetch accounts on different index
    let [OWNER, Seed, Private, Public, Team_Operations, Advisors, Play_to_Earn, Staking, Treasury] = accounts;
    let RaceKingdomContract;

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
    });

    it('Checking Balances --', async () => {

        log(
            `${chalk.green("Checking Seed Balance...")}`
        )
        let seedBalance = await checkBalance(Seed)
        assert.equal(
            seedBalance,
            269_000_000 * multiplier,
            "Seed Balance must be equal to 269,000,000"
        );
        log(
            `${chalk.green("Checking Private Balance...")}`
        )
        let privateBalance = await checkBalance(Private)
        assert.equal(
            privateBalance,
            444_000_000 * multiplier,
            "Private Balance must be equal to 444,000,000"
        );
        log(
            `${chalk.green("Checking Public Balance...")}`
        )
        let publicBalance = await checkBalance(Public)
        assert.equal(
            publicBalance,
            148_000_000 * multiplier,
            "Public Balance must be equal to 148,000,000"
        );
        log(
            `${chalk.green("Checking Team_Operations Balance...")}`
        )
        let team_OperationsBalance = await checkBalance(Team_Operations)
        assert.equal(
            team_OperationsBalance,
            555_000_000 * multiplier,
            "Team_Operations Balance must be equal to 555,000,000"
        );
        log(
            `${chalk.green("Checking Advisors Balance...")}`
        )
        let advisorsBalance = await checkBalance(Advisors)
        assert.equal(
            advisorsBalance,
            185_000_000 * multiplier,
            "Advisors Balance must be equal to 185,000,000"
        );
        log(
            `${chalk.green("Checking Play_to_Earn Balance...")}`
        )
        let play_to_EarnBalance = await checkBalance(Play_to_Earn)
        assert.equal(
            play_to_EarnBalance,
            1_110_000_000 * multiplier,
            "Play_to_Earn Balance must be equal to 1,110,000,000"
        );
        log(
            `${chalk.green("Checking Staking Balance...")}`
        )
        let stakingBalance = await checkBalance(Staking)
        assert.equal(
            stakingBalance,
            555_000_000 * multiplier,
            "Staking Balance must be equal to 555,000,000"
        );
        log(
            `${chalk.green("Checking Treasury Balance...")}`
        )
        let treasuryBalance = await checkBalance(Treasury)
        assert.equal(
            treasuryBalance,
            407_000_000 * multiplier,
            "Treasury Balance must be equal to 407,000,000"
        );

    });

    async function checkBalance(_address) {

        return await RaceKingdomContract.balanceOf(_address)

    }

});