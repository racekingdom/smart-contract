const RaceKingdom = artifacts.require('./RaceKingdom.sol');
const {
    expectRevert, expectEvent
} = require("@openzeppelin/test-helpers");

contract('RaceKingdom', (accounts) => {

    // fetch accounts on different index
    let [OWNER, Seed, Private, Public, Team_Operations, Advisors, Play_to_Earn, Staking, Treasury] = accounts;
    let RaceKingdomContract;

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
    }); 

    it('only owner can renounce ownership', async () => {
        await expectRevert(
            RaceKingdomContract.renounceOwnership({from:Seed}),
            "Ownable: caller is not the owner"
        )
        
    })

    it('renounce ownership success', async () => {
            let result = await RaceKingdomContract.renounceOwnership({from:OWNER})
            expectEvent(result, 'OwnershipTransferred');
            let newOwner = await RaceKingdomContract.owner()
            assert.equal(
                newOwner,
                '0x0000000000000000000000000000000000000000',
                "renounce ownership failed"
            )

        
    })
    
});