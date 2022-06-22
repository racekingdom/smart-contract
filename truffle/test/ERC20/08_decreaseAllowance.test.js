const RaceKingdom = artifacts.require('./RaceKingdom.sol');
const {
    expectEvent
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
    

    it('decreaseAllowance success', async () => {
        const initialAmount = 1000;
        const expectedAmount = 500;
        
        await RaceKingdomContract.approve(Private, initialAmount, { from: Seed });
        const resultBeforeIncrease = await RaceKingdomContract.allowance(Seed, Private, { from: Seed });
        const resultIncrease = await RaceKingdomContract.decreaseAllowance(Private, 500, { from: Seed });
        const resultAfterIncrease = await RaceKingdomContract.allowance(Seed, Private, { from: Seed });
        
        assert.equal(initialAmount, resultBeforeIncrease.toNumber(), 'wrong result berore increase');
        assert.equal(expectedAmount, resultAfterIncrease.toNumber(), 'wrong result after increase');
        expectEvent(resultIncrease, 'Approval');
    });
});