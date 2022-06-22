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

    it('approve should throw if spender is zero address', async () => {
    
        await expectRevert(
            RaceKingdomContract.approve('0x0000000000000000000000000000000000000000', 1000, { from: Seed }),
            'ERC20: approve to the zero address'
        );
    });

    it('approve success', async () => {
        const result = await RaceKingdomContract.approve(Private, 1000, { from: Seed });
        
        expectEvent(result, 'Approval');
    });

});