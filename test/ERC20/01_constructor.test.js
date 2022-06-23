const RaceKingdom = artifacts.require('./RaceKingdom.sol');
const chalk = require('chalk');
const log = console.log;
const decimals = 1e18

contract('RaceKingdom', (accounts) => {
    let SeedBalance = 296_000_000 * decimals
    let PrivateBalance = 444_000_000 * decimals
    let PublicBalance = 148_000_000 * decimals
    let Team_OperationsBalance = 555_000_000 * decimals
    let AdvisorsBalance = 185_000_000 * decimals
    let Play_to_EarnBalance = 1_110_000_000 * decimals
    let StakingBalance = 555_000_000 * decimals
    let TreasuryBalance = 407_000_000 * decimals

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

    it('Checking balances for all--', async () => {

        let seedBalanceMinted = await checkBalance(Seed)
        assert.equal(
            seedBalanceMinted,
            SeedBalance,
            `Seed Balance must be equal to ${setDecimals(SeedBalance)}`
        );
     
        let privateBalanceMinted = await checkBalance(Private)
        assert.equal(
            privateBalanceMinted,
            PrivateBalance,
            `Private Balance must be equal to ${setDecimals(PrivateBalance)}`
        );
       
        let publicBalanceMinted = await checkBalance(Public)
        assert.equal(
            publicBalanceMinted,
            PublicBalance,
            `Public Balance must be equal to ${setDecimals(PublicBalance)}`
        );
       
        let team_OperationsBalanceMinted = await checkBalance(Team_Operations)
        assert.equal(
            team_OperationsBalanceMinted,
            Team_OperationsBalance,
            `Team_Operations Balance must be equal to ${setDecimals(Team_OperationsBalance)}`
        );
       
        let advisorsBalanceMinted = await checkBalance(Advisors)
        assert.equal(
            advisorsBalanceMinted,
            AdvisorsBalance,
            `Advisors Balance must be equal to ${setDecimals(AdvisorsBalance)}`
        );
       
        let play_to_EarnBalanceMinted = await checkBalance(Play_to_Earn)
        assert.equal(
            play_to_EarnBalanceMinted,
            Play_to_EarnBalance,
            `Play_to_Earn Balance must be equal to ${setDecimals(Play_to_EarnBalance)}`
        );
      
        let stakingBalanceMinted = await checkBalance(Staking)
        assert.equal(
            stakingBalanceMinted,
            StakingBalance,
            `Staking Balance must be equal to ${setDecimals(StakingBalance)}`
        );
       
        let treasuryBalanceMinted = await checkBalance(Treasury)
        assert.equal(
            treasuryBalanceMinted,
            TreasuryBalance,
            `Treasury Balance must be equal to ${setDecimals(TreasuryBalance)}`
        );

    });

    it('Checking maximum supply', async () => {
    
        let maxSupply = await RaceKingdomContract.MAX_SUPPLY()
        let totalSupply = await RaceKingdomContract.totalSupply()
        assert.equal(
            convertToNum(maxSupply),
            convertToNum(totalSupply),
            `Treasury Balance must be equal to ${setDecimals(maxSupply)}`
        );

    });
    function convertToNum(balance){
        return Number(BigInt(balance)) / 1e18
    }

    function setDecimals(balance){
          return balance/decimals
    }
    
    async function checkBalance(_address) {

        return await RaceKingdomContract.balanceOf(_address)

    }
});