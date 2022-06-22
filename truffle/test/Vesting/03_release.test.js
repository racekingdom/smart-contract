const RaceKingdom = artifacts.require('./RaceKingdom.sol');
const RKVesting = artifacts.require('./RKVesting.sol');
const {
    time
} = require("@openzeppelin/test-helpers");
const {
    expectRevert, expectEvent
} = require("@openzeppelin/test-helpers");

const oneMonth = 2628000 //1 month
const SeedVesting1Amount = '29600000'


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

    it('only beneficiary and owner can release vested tokens', async () => {

       
        let vestingAmount = web3.utils.toWei(SeedVesting1Amount, 'ether')
        let currentTime = await time.latest()

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
        await expectRevert(
            RKVestingContract.release(vestingId, vestingAmount,{from:Private}),
            "RKVesting: only beneficiary and owner can release vested tokens"   
           ) 
        
    })

    it('cannot release tokens, not enough vested tokens', async () => {

       
        let vestingAmount = web3.utils.toWei(SeedVesting1Amount, 'ether')
        let currentTime = await time.latest()

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
        let releaseAmount = vestingAmount + 1000;
        await expectRevert(
            RKVestingContract.release(vestingId, releaseAmount ,{from:Seed}),
            "RKVesting: cannot release tokens, not enough vested tokens"   
           ) 
        
    })

    it('reverts if the vesting schedule does not exist or has been revoked', async () => {

       
        let vestingAmount = web3.utils.toWei(SeedVesting1Amount, 'ether')
        let currentTime = await time.latest()

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
        await RKVestingContract.revoke(vestingId);
        await expectRevert(
            RKVestingContract.release(vestingId, vestingAmount ,{from:Seed}),
            "revert"   
           ) 
        
    })

    it('release success', async () => {

        let vestingAmount = web3.utils.toWei(SeedVesting1Amount, 'ether')
        let currentTime = await time.latest()

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
       
        let result = await RKVestingContract.release(vestingId, vestingAmount ,{from:Seed})
        expectEvent(result, 'Released');
        
    })

})