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

    it('transfer should throw if to address is not valid', async () => {
        await expectRevert(
            RaceKingdomContract.transfer('0x0000000000000000000000000000000000000000', 1000, { from: Seed }),
            'ERC20: transfer to the zero address'
        );
    });

    it('transfer should throw if balance is insufficient', async () => {
        await expectRevert(
            RaceKingdomContract.transfer(Seed, 1000, { from: OWNER }),
            'ERC20: transfer amount exceeds balance'
        );
    });

    it('transfer success', async () => {
        const result = await RaceKingdomContract.transfer(Private, 1000, { from: Seed });
       
        expectEvent(result, 'Transfer');
    });

});