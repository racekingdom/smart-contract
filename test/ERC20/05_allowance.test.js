const RaceKingdom = artifacts.require('./RaceKingdom.sol');

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

    it('not allowance', async () => {
        const result = await RaceKingdomContract.allowance(Seed, Private, { from: Seed });
        
        assert.equal(0, result.toNumber(), 'wrong result');
    });

    it('allowance', async () => {
        const expectedAmount = 1000;
        
        await RaceKingdomContract.approve(Private, expectedAmount, { from: Seed });
        const result = await RaceKingdomContract.allowance(Seed, Private, { from: Seed });
        
        assert.equal(expectedAmount, result.toNumber(), 'wrong result');
    });
});