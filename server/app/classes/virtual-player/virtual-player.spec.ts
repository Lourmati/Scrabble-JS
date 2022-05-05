/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
/* eslint-disable prettier/prettier */
import { Option } from '@app/constants/probalities';
import { expect } from 'chai';
import { VirtualPlayer } from './virtual-player';
import { VirtualPlayerCommand } from './virtual-player-commands';
import { VirtualPlayerLevel } from './virtual-player-level';

const MOCK_HOSTNAME = 'Host';

const COMMANDS = [VirtualPlayerCommand.PLACE, VirtualPlayerCommand.EXCHANGE, VirtualPlayerCommand.TAKETURN];
describe('VirtualPlayer', () => {
    let virtualPlayer: VirtualPlayer;
    beforeEach(() => {
        virtualPlayer = new VirtualPlayer(MOCK_HOSTNAME, [], VirtualPlayerLevel.BEGINNER);
    });

    it('Should return the first element of the options when threshold is smaller than random', (done: Mocha.Done) => {
        const options: Option<VirtualPlayerCommand>[] = [{ element: VirtualPlayerCommand.PLACE, probability: 0 }];
        const command = virtualPlayer.getRandomElement(options);
        expect(command).to.be.equal(VirtualPlayerCommand.PLACE);
        done();
    });

    it('Should return on of the three virtual player commands based on probality  ', (done: Mocha.Done) => {
        const command = virtualPlayer.getCommand();
        expect(COMMANDS).include(command);
        done();
    });

    it('Should return on of the three virtual player commands based on probality  ', (done: Mocha.Done) => {
        virtualPlayer['level'] = VirtualPlayerLevel.EXPERT;
        expect(virtualPlayer.getCommand()).to.equal(VirtualPlayerCommand.PLACE);
        done();
    });

    it('Should return one of the three scoreContraints based on probality when level is beginner', (done: Mocha.Done) => {
        const scoreConstraint = virtualPlayer.getScoreConstraint();
        expect(scoreConstraint).to.have.property('minScore');
        expect(scoreConstraint).to.have.property('maxScore');
        done();
    });
    it('Should return the only score constraintes when level is expert', (done: Mocha.Done) => {
        virtualPlayer = new VirtualPlayer(MOCK_HOSTNAME, [], VirtualPlayerLevel.EXPERT);
        const scoreConstraint = virtualPlayer.getScoreConstraint();
        expect(scoreConstraint).to.have.property('minScore');
        expect(scoreConstraint).to.have.property('maxScore');
        done();
    });

    it('Should return a random exchange', () => {
        virtualPlayer.getEasel()['letters'] = [
            { letter: 'A', point: 1 },
            { letter: 'B', point: 2 },
            { letter: 'C', point: 3 },
        ];
        const exchange = virtualPlayer.getExchange(VirtualPlayerLevel.BEGINNER, 7);
        expect(exchange.letters.length).have.greaterThanOrEqual(1);
        expect(exchange.letters[0]).to.have.property('letter');
        expect(exchange.letters[0]).to.have.property('point');
    });
    it('Should return a random exchange', () => {
        virtualPlayer.getEasel()['letters'] = [
            { letter: 'A', point: 1 },
            { letter: 'B', point: 2 },
            { letter: 'C', point: 3 },
        ];
        const exchange = virtualPlayer.getExchange(VirtualPlayerLevel.EXPERT, 7);
        expect(exchange.letters.length).have.greaterThanOrEqual(1);
        expect(exchange.letters[0]).to.have.property('letter');
        expect(exchange.letters[0]).to.have.property('point');
    });

    it('Should return a random index of easel', () => {
        for (let i = 0; i < 100; i++) {
            const number = virtualPlayer['getRandomEaselIndex'](i % 2 === 0);
            expect(number).to.be.a('number');
            expect(number).to.be.greaterThanOrEqual(0);
            expect(number).to.be.lessThanOrEqual(6);
        }
    });
});
