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

    it('transferFrom should throw if balance is insufficient', async () => {
        await RaceKingdomContract.approve(Seed, 1000, { from: OWNER });

        await expectRevert(
            RaceKingdomContract.transferFrom(OWNER, Seed, 1000, { from: Seed }),
            'ERC20: transfer amount exceeds balance'
        );
    });

    it('transferFrom should throw if sender is not approved', async () => {
        await expectRevert(
            RaceKingdomContract.transferFrom(Seed, Private, 1000, { from: Seed }),
            'ERC20: insufficient allowance'
        );
    });

    it('transferFrom success', async () => {
        await RaceKingdomContract.approve(OWNER, 1000, { from: Seed });
        const result = await RaceKingdomContract.transferFrom(Seed, Private, 1000, { from: OWNER });
        
        expectEvent(result, 'Transfer');
    });
});