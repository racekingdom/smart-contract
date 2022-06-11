const RaceKingdom = artifacts.require('./RaceKingdom.sol');
const RKVesting = artifacts.require('./RKVesting.sol');
const {
    time
} = require("@openzeppelin/test-helpers");
const chalk = require('chalk');
const log = console.log;

const oneMonth = 2628000 //1 month
const threeMonths = 7884000 //3 months
const eighteenMonths = 47300000 //18 months
const oneYear = 31536000 //1 year
const nineMonths = 23652000 //9 months

const multiplier = 1e18

const SeedVesting1Amount = '239400000'
const SeedVesting2Amount = '29600000'
const PrivateVestingAmount = '377400000'
const Team_OperationsVestingAmount = '555000000'
const Play_to_EarnVestingAmount = '1110000000'
const TreasuryVestingAmount = '407000000'

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

    });

    it('Vesting For Seed --', async () => {


        let vestingAmount = web3.utils.toWei(SeedVesting1Amount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Seed)

        log("Balance of Seed Before Vesting = ", Number(BigInt(balanceBeforeVesting)) / 1e18)

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Seed
        });
        await RKVestingContract.createVestingSchedule(
            Seed,
            currentTime,
            threeMonths,
            eighteenMonths,
            threeMonths,
            true,
            vestingAmount
        )

        let balanceAfterVesting = await RaceKingdomContract.balanceOf(Seed);
        log("Balance of Seed After Vesting = ", Number(BigInt(balanceAfterVesting)) / 1e18)

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)


        let computeReleasableAmountInitial = await RKVestingContract.computeReleasableAmount(vestingId)
        log("Compute Releasable Amount Initial = ", Number(BigInt(computeReleasableAmountInitial)) / 1e18)

        for (let i = 0; i < 6; i++) {
            log("Time increased by 3 months....")
            await increaseTime()

            let computeReleasableAmount = await RKVestingContract.computeReleasableAmount(vestingId)

            log("Compute Releasable Amount = ", Number(BigInt(computeReleasableAmount)) / 1e18)

        }
        log("Request For Release....")
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Seed);

        log("Balance of Seed After Release = ", Number(BigInt(balanceAfterRelease)) / 1e18)

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });


    it('Vesting-2 For Seed --', async () => {


        let vestingAmount = web3.utils.toWei(SeedVesting2Amount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Seed)

        log("Balance of Seed Before Vesting = ", Number(BigInt(balanceBeforeVesting)) / 1e18)

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Seed
        });
        await RKVestingContract.createVestingSchedule(
            Seed,
            currentTime,
            oneMonth,
            oneMonth,
            oneMonth,
            true,
            vestingAmount
        )

        let balanceAfterVesting = await RaceKingdomContract.balanceOf(Seed);
        log("Balance of Seed After Vesting = ", Number(BigInt(balanceAfterVesting)) / 1e18)

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)

        let computeReleasableAmountInitial = await RKVestingContract.computeReleasableAmount(vestingId)
        log("Compute Releasable Amount Initial = ", Number(BigInt(computeReleasableAmountInitial)) / 1e18)

        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
        let computeReleasableAmount = await RKVestingContract.computeReleasableAmount(vestingId)
        log("Compute Releasable Amount = ", Number(BigInt(computeReleasableAmount)) / 1e18)

        log("Request For Release....")
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Seed);

        log("Balance of Seed After Release = ", Number(BigInt(balanceAfterRelease)) / 1e18)

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('Vesting For Private --', async () => {


        let vestingAmount = web3.utils.toWei(PrivateVestingAmount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Private)

        log("Balance of Private Before Vesting = ", Number(BigInt(balanceBeforeVesting)) / 1e18)

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Private
        });
        await RKVestingContract.createVestingSchedule(
            Private,
            currentTime,
            threeMonths,
            oneYear,
            threeMonths,
            true,
            vestingAmount
        )

        let balanceAfterVesting = await RaceKingdomContract.balanceOf(Private);
        log("Balance of Private After Vesting = ", Number(BigInt(balanceAfterVesting)) / 1e18)

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)

        let computeReleasableAmountInitial = await RKVestingContract.computeReleasableAmount(vestingId)
        log("Compute Releasable Amount Initial = ", Number(BigInt(computeReleasableAmountInitial)) / 1e18)

        for (let i = 0; i < 4; i++) {
            log("Time increased by 3 months....")
            await increaseTime()

            let computeReleasableAmount = await RKVestingContract.computeReleasableAmount(vestingId)

            log("Compute Releasable Amount = ", Number(BigInt(computeReleasableAmount)) / 1e18)

        }
        log("Request For Release....")
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Private);

        log("Balance of Private After Release = ", Number(BigInt(balanceAfterRelease)) / 1e18)

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('Vesting For Team_Operations --', async () => {


        let vestingAmount = web3.utils.toWei(Team_OperationsVestingAmount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Team_Operations)
        log("Balance of Team_Operations Before Vesting = ", Number(BigInt(balanceBeforeVesting)) / 1e18)

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Team_Operations
        });
        await RKVestingContract.createVestingSchedule(
            Team_Operations,
            Number(BigInt(currentTime)) + nineMonths,
            1,
            oneMonth * 36,
            threeMonths,
            true,
            vestingAmount
        )

        let balanceAfterVesting = await RaceKingdomContract.balanceOf(Team_Operations);
        log("Balance of Team_Operations After Vesting = ", Number(BigInt(balanceAfterVesting)) / 1e18)

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)

        let computeReleasableAmountInitial = await RKVestingContract.computeReleasableAmount(vestingId)
        log("Compute Releasable Amount Initial = ", Number(BigInt(computeReleasableAmountInitial)) / 1e18)

        for (let i = 0; i < 15; i++) {
            log("Time increased by 3 months....")
            await increaseTime()

            let computeReleasableAmount = await RKVestingContract.computeReleasableAmount(vestingId)

            log("Compute Releasable Amount = ", Number(BigInt(computeReleasableAmount)) / 1e18)

        }
        log("Request For Release....")
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Team_Operations);

        log("Balance of Team_Operations After Release = ", Number(BigInt(balanceAfterRelease)) / 1e18)

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            Team_OperationsVestingAmount * multiplier,
            `Balance After Vesting Complete Should be equal to ${Team_OperationsVestingAmount}`
        );
    });

    it('Vesting For Play_to_Earn --', async () => {


        let vestingAmount = web3.utils.toWei(Play_to_EarnVestingAmount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Play_to_Earn)

        log("Balance of Play_to_Earn Before Vesting = ", Number(BigInt(balanceBeforeVesting)) / 1e18)

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Play_to_Earn
        });
        await RKVestingContract.createVestingSchedule(
            Play_to_Earn,
            Number(BigInt(currentTime)),
            1,
            oneMonth * 60,
            threeMonths,
            true,
            vestingAmount
        )

        let balanceAfterVesting = await RaceKingdomContract.balanceOf(Play_to_Earn);
        log("Balance of Play_to_Earn After Vesting = ", Number(BigInt(balanceAfterVesting)) / 1e18)

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)

        let computeReleasableAmountInitial = await RKVestingContract.computeReleasableAmount(vestingId)
        log("Compute Releasable Amount Initial = ", Number(BigInt(computeReleasableAmountInitial)) / 1e18)

        for (let i = 0; i < 20; i++) {
            log("Time increased by 3 months....")
            await increaseTime()

            let computeReleasableAmount = await RKVestingContract.computeReleasableAmount(vestingId)

            log("Compute Releasable Amount = ", Number(BigInt(computeReleasableAmount)) / 1e18)

        }
        log("Request For Release....")
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Play_to_Earn);

        log("Balance of Play_to_Earn After Release = ", Number(BigInt(balanceAfterRelease)) / 1e18)

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            Play_to_EarnVestingAmount * multiplier,
            `Balance After Vesting Complete Should be equal to ${Play_to_EarnVestingAmount}`
        );
    });

    it('Vesting For Treasury with Immediate Release--', async () => {


        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Treasury)

        log("Balance of Treasury Before Vesting = ", Number(BigInt(balanceBeforeVesting)) / 1e18)

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await RKVestingContract.createVestingSchedule(
            Treasury,
            Number(BigInt(currentTime)),
            1,
            oneMonth * 36,
            threeMonths,
            true,
            vestingAmount
        )

        let balanceAfterVesting = await RaceKingdomContract.balanceOf(Treasury);
        log("Balance of Treasury After Vesting = ", Number(BigInt(balanceAfterVesting)) / 1e18)

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)

        let computeReleasableAmountInitial = await RKVestingContract.computeReleasableAmount(vestingId)
        log("Compute Releasable Amount Initial = ", Number(BigInt(computeReleasableAmountInitial)) / 1e18)

        for (let i = 0; i < 12; i++) {
            log("Time increased by 3 months....")
            await increaseTime()

            let computeReleasableAmount = await RKVestingContract.computeReleasableAmount(vestingId)

            log("Compute Releasable Amount = ", Number(BigInt(computeReleasableAmount)) / 1e18)
            log(`Request For Release for ${Number(BigInt(computeReleasableAmount)) / 1e18}....`)
            await RKVestingContract.release(vestingId, computeReleasableAmount)
            let balanceAfterRelease = await RaceKingdomContract.balanceOf(Treasury);

            log("Balance of Treasury After Release = ", Number(BigInt(balanceAfterRelease)) / 1e18)


        }
        let totalBalanceAfterRelease = await RaceKingdomContract.balanceOf(Treasury);

        assert.equal(
            Number(BigInt(totalBalanceAfterRelease)),
            TreasuryVestingAmount * multiplier,
            `Balance After Vesting Complete Should be equal to ${TreasuryVestingAmount}`
        );
    });

    async function increaseTime() {

        let duration = time.duration.seconds(threeMonths);
        await time.increase(duration);
    }

});