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

    it('only owner can transfer ownership', async () => {
        await expectRevert(
            RaceKingdomContract.transferOwnership(Seed,{from:Seed}),
            "Ownable: caller is not the owner"
        )
        
    })

    it('new owner cannot be zero address', async () => {
        await expectRevert(
            RaceKingdomContract.transferOwnership('0x0000000000000000000000000000000000000000',{from:OWNER}),
            "Ownable: new owner is the zero address"
        )
        
    })

    it('transfer ownership success', async () => {
            let result = await RaceKingdomContract.transferOwnership(Seed,{from:OWNER})
            expectEvent(result, 'OwnershipTransferred');
        
    })
    
});