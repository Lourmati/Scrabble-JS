/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { GameMode } from '@app/classes/game/game-mode';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { Room } from '@app/classes/room/room';
import { expect } from 'chai';
import { describe } from 'mocha';

const MOCK_PLAYER: PlayerInformations = { id: 'player_id', name: 'player_name' };

describe('Room', () => {
    let room: Room;

    beforeEach(() => {
        room = new Room('id', MOCK_PLAYER, { mode: GameMode.CLASSIC, timer: 0, dictionary: '' });
    });

    it('Should create room with parameters from constructor', (done: Mocha.Done) => {
        expect(room.id).to.equal('id');
        expect(room.host).to.deep.equal(MOCK_PLAYER);
        expect(room.parameters).to.deep.equal({ mode: GameMode.CLASSIC, timer: 0, dictionary: '' });
        done();
    });

    it('Should return true if the room has already a guest', (done: Mocha.Done) => {
        room.guest = MOCK_PLAYER;
        expect(room.isFull()).to.be.true;
        done();
    });

    it("Should return false if the room doesn't have a guest", (done: Mocha.Done) => {
        room.guest = undefined as unknown as PlayerInformations;
        expect(room.isFull()).to.be.false;
        done();
    });

    it('Should add guest to room when calling addGuest', (done: Mocha.Done) => {
        room.addGuest(MOCK_PLAYER);
        expect(room.guest).to.deep.equal(MOCK_PLAYER);
        done();
    });

    it('Should remove guest from room when calling removeGuest', (done: Mocha.Done) => {
        room.guest = MOCK_PLAYER;
        room.removeGuest();
        expect(room.guest).to.be.undefined;
        done();
    });
});
