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

    it('only owner can renounce ownership', async () => {
        await expectRevert(
            RKVestingContract.renounceOwnership({from:Seed}),
            "Ownable: caller is not the owner"
        )
        
    })

    it('renounce ownership success', async () => {
            let result = await RKVestingContract.renounceOwnership({from:OWNER})
            expectEvent(result, 'OwnershipTransferred');
            let newOwner = await RKVestingContract.owner()
            assert.equal(
                newOwner,
                '0x0000000000000000000000000000000000000000',
                "renounce ownership failed"
            )

        
    })
    
})