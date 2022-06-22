const RaceKingdom = artifacts.require('./RaceKingdom.sol');
const RKVesting = artifacts.require('./RKVesting.sol');
const {
    expectRevert, expectEvent
} = require("@openzeppelin/test-helpers");

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

    it('only owner can transfer ownership', async () => {
        await expectRevert(
            RKVestingContract.transferOwnership(Seed,{from:Seed}),
            "Ownable: caller is not the owner"
        )
        
    })

    it('new owner cannot be zero address', async () => {
        await expectRevert(
            RKVestingContract.transferOwnership('0x0000000000000000000000000000000000000000',{from:OWNER}),
            "Ownable: new owner is the zero address"
        )
        
    })

    it('transfer ownership success', async () => {
            let result = await RKVestingContract.transferOwnership(Seed,{from:OWNER})
            expectEvent(result, 'OwnershipTransferred');
        
    })
    
})