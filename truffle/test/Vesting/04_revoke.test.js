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

    it('only owner can revoke', async () => {

        
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
            RKVestingContract.revoke(vestingId,{from:Seed}),
            "Ownable: caller is not the owner"
        
        );
       
    })

    it('vesting is not revocable', async () => {

        
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
        false,
        vestingAmount
    )

    let vestingId = await RKVestingContract.getVestingIdAtIndex(0)
    let duration = time.duration.seconds(oneMonth);
    await time.increase(duration);
    await expectRevert(
        RKVestingContract.revoke(vestingId,{from:OWNER}),
        "RKVesting: vesting is not revocable"
    
       );
   
    })

    it('revoke success', async () => {

        
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
        
        let result = await RKVestingContract.revoke(vestingId,{from:OWNER})
        expectEvent(result, 'Revoked');
    })
    

})