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

    it('only owner can withdraw remaning tokens', async () => {

        let vestingAmount = web3.utils.toWei(SeedVesting1Amount, 'ether')

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Seed
        });
       
        await RKVestingContract.getWithdrawableAmount()
      
        await expectRevert(
            RKVestingContract.withdraw(vestingAmount,{from:Seed}),
            "Ownable: caller is not the owner"   
           ) 
        
    })

    it('cannot withdraw tokens, not enough withdrawable funds', async () => {
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

        await RKVestingContract.getVestingIdAtIndex(0)
        let duration = time.duration.seconds(oneMonth);
        await time.increase(duration);
       
        await expectRevert(
            RKVestingContract.withdraw(1000 ,{from:OWNER}),
            "RKVesting: not enough withdrawable funds"   
           ) 
        
    })

    it('withdraw success', async () => {

        let vestingAmount = web3.utils.toWei(SeedVesting1Amount, 'ether')

        await RaceKingdomContract.transfer(RKVestingContract.address, vestingAmount, {
            from: Seed
        });
       
        await RKVestingContract.getWithdrawableAmount()
        let result = await RKVestingContract.withdraw(vestingAmount,{from:OWNER})
        expectEvent(result, 'Withdraw');
        
           
        
    })

   
})