const RaceKingdom = artifacts.require('./RaceKingdom.sol');
const RKVesting = artifacts.require('./RKVesting.sol');
const {
    time
} = require("@openzeppelin/test-helpers");
const {
    expectRevert
} = require("@openzeppelin/test-helpers");

const oneMonth = 2628000 //1 month
const twoMonths = 5256000 //2months
const threeMonths = 7884000 //3 months
const oneYear = 31536000 //1 year
const nineMonths = 23652000 //9 months

const multiplier = 1e18

const SeedVesting1Amount = '29600000'
const SeedVesting2Amount = '266400000'
const PrivateVesting1Amount = '66600000'
const PrivateVesting2Amount = '377400000'
const PublicVestingAmount = '148000000'
const Team_OperationsVestingAmount = '555000000'
const AdvisorsVestingAmount = '185000000'
const Play_to_EarnVestingAmount = '1110000000'
const StakingVestingAmount = '555000000'
const TreasuryVestingAmount = '407000000'

contract('RKVesting', (accounts) => {

    // fetch accounts on different index
    let [OWNER, Seed, Private, Public, Team_Operations, Advisors, Play_to_Earn, Staking, Treasury] = accounts;
    let RaceKingdomContract;
    let RKVestingContract;

    beforeEach(async () => {

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

    it('createVestingSchedule should throw if _beneficiary is zero address', async () => {

        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')
        let currentTime = await time.latest()

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await expectRevert(
            RKVestingContract.createVestingSchedule(
                '0x0000000000000000000000000000000000000000',
                Number(BigInt(currentTime)),
                1,
                oneMonth * 36,
                threeMonths,
                true,
                vestingAmount
            ),
            "RKVesting: beneficiary can't be zero address"
        )

    })

    it('cannot createVestingSchedule because of insufficient tokens', async () => {

        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')
        let currentTime = await time.latest()

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await expectRevert(
            RKVestingContract.createVestingSchedule(
                Treasury,
                Number(BigInt(currentTime)),
                1,
                oneMonth * 36,
                threeMonths,
                true,
                vestingAmount + 1000
            ),
            "RKVesting: cannot create vesting schedule because not sufficient tokens"
        )

    })

    it('cliff cannot be greater than vesting duration', async () => {

        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')
        let currentTime = await time.latest()

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await expectRevert(
            RKVestingContract.createVestingSchedule(
                Treasury,
                Number(BigInt(currentTime)),
                threeMonths,
                oneMonth,
                threeMonths,
                true,
                vestingAmount
            ),
            "RKVesting: cliff can't be greater than vesting duration"
        )

    })

    it('duration and amount must be > 0', async () => {

        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')
        let currentTime = await time.latest()

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await expectRevert(
            RKVestingContract.createVestingSchedule(
                Treasury,
                Number(BigInt(currentTime)),
                0,
                0,
                threeMonths,
                true,
                vestingAmount
            ),
            "RKVesting: duration must be > 0"
        )

        await expectRevert(
            RKVestingContract.createVestingSchedule(
                Treasury,
                Number(BigInt(currentTime)),
                1,
                oneMonth * 36,
                threeMonths,
                true,
                0
            ),
            "RKVesting: amount must be > 0"
        )

    })

    it('create vesting schedule for seed - 1(10% release on 30 day)', async () => {


        let vestingAmount = web3.utils.toWei(SeedVesting1Amount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Seed)

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

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)

        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Seed);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('create vesting schedule for seed - 2', async () => {


        let vestingAmount = web3.utils.toWei(SeedVesting2Amount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Seed)

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Seed
        });
        await RKVestingContract.createVestingSchedule(
            Seed,
            currentTime,
            threeMonths,
            oneMonth * 18,
            threeMonths,
            true,
            vestingAmount
        )

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)
        for (let i = 0; i < 6; i++) {
            await increaseTime()
        }
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Seed);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('create vesting schedule for private - 1(15% release on 30 day)', async () => {


        let vestingAmount = web3.utils.toWei(PrivateVesting1Amount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Seed)

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

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Seed);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('create vesting schedule for private - 2', async () => {


        let vestingAmount = web3.utils.toWei(PrivateVesting2Amount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Private)

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

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)
        for (let i = 0; i < 4; i++) {
            await increaseTime()
        }
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Private);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('create vesting schedule for public', async () => {


        let vestingAmount = web3.utils.toWei(PublicVestingAmount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Public)

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Public
        });
        await RKVestingContract.createVestingSchedule(
            Public,
            Number(BigInt(currentTime)) - oneMonth,
            1,
            twoMonths,
            oneMonth,
            true,
            vestingAmount
        )

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Public);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('create vesting schedule for team_operations', async () => {


        let vestingAmount = web3.utils.toWei(Team_OperationsVestingAmount, 'ether')
        let currentTime = await time.latest()

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

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)
        for (let i = 0; i < 15; i++) {
            await increaseTime()
        }
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Team_Operations);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            Team_OperationsVestingAmount * multiplier,
            `Balance After Vesting Complete Should be equal to ${Team_OperationsVestingAmount}`
        );
    });

    it('create vesting schedule for advisors', async () => {


        let vestingAmount = web3.utils.toWei(AdvisorsVestingAmount, 'ether')

        let currentTime = await time.latest()
        let balanceBeforeVesting = await RaceKingdomContract.balanceOf(Advisors)

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Advisors
        });
        await RKVestingContract.createVestingSchedule(
            Advisors,
            Number(BigInt(currentTime)) + threeMonths,
            1,
            oneMonth * 24,
            threeMonths,
            true,
            vestingAmount
        )

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)
        for (let i = 0; i < 9; i++) {
            await increaseTime()
        }
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Advisors);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            balanceBeforeVesting,
            `Balance After Vesting Complete Should be equal to ${Number(BigInt(balanceBeforeVesting)) / 1e18}`
        );
    });

    it('create vesting schedule for play_to_earn', async () => {


        let vestingAmount = web3.utils.toWei(Play_to_EarnVestingAmount, 'ether')
        let currentTime = await time.latest()

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Play_to_Earn
        });
        await RKVestingContract.createVestingSchedule(
            Play_to_Earn,
            Number(BigInt(currentTime)) - threeMonths,
            1,
            oneMonth * 60,
            threeMonths,
            true,
            vestingAmount
        )

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)
        for (let i = 0; i < 19; i++) {
            await increaseTime()
        }
        await RKVestingContract.release(vestingId, vestingAmount)
        let balanceAfterRelease = await RaceKingdomContract.balanceOf(Play_to_Earn);

        assert.equal(
            Number(BigInt(balanceAfterRelease)),
            Play_to_EarnVestingAmount * multiplier,
            `Balance After Vesting Complete Should be equal to ${Play_to_EarnVestingAmount}`
        );
    });

    it('create vesting schedule for staking rewards', async () => {


        let vestingAmount = web3.utils.toWei(StakingVestingAmount, 'ether')
        let currentTime = await time.latest()

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Staking
        });
        await RKVestingContract.createVestingSchedule(
            Staking,
            Number(BigInt(currentTime)),
            1,
            oneMonth,
            oneMonth,
            true,
            vestingAmount
        )

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);

        await RKVestingContract.release(vestingId, vestingAmount)

        let totalBalanceAfterRelease = await RaceKingdomContract.balanceOf(Staking);

        assert.equal(
            Number(BigInt(totalBalanceAfterRelease)),
            StakingVestingAmount * multiplier,
            `Balance After Vesting Complete Should be equal to ${StakingVestingAmount}`
        );
    });


    it('create vesting schedule for treasury with immediate release--', async () => {


        let vestingAmount = web3.utils.toWei(TreasuryVestingAmount, 'ether')
        let currentTime = await time.latest()

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Treasury
        });
        await RKVestingContract.createVestingSchedule(
            Treasury,
            Number(BigInt(currentTime)) - threeMonths,
            1,
            oneMonth * 33,
            threeMonths,
            true,
            vestingAmount
        )

        let vestingId = await RKVestingContract.getVestingIdAtIndex(0)
        let computeReleasableAmountStart = await RKVestingContract.computeReleasableAmount(vestingId)
        await RKVestingContract.release(vestingId, computeReleasableAmountStart)

        for (let i = 0; i < 10; i++) {
            await increaseTime()
            let computeReleasableAmount = await RKVestingContract.computeReleasableAmount(vestingId)
            await RKVestingContract.release(vestingId, computeReleasableAmount)

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

})