/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Easel } from '@app/classes/easel/easel';
import { Player } from '@app/classes/player/player';
import { expect } from 'chai';
import { describe } from 'mocha';
import { createStubInstance } from 'sinon';
import Sinon = require('sinon');

describe('Player', () => {
    let player: Player;

    beforeEach(() => {
        player = new Player('name', 'socketId', []);
    });

    it('Should return id', (done: Mocha.Done) => {
        expect(player.getId()).to.equal('socketId');
        done();
    });

    it('Should assing constructor parameters to attributs', (done: Mocha.Done) => {
        expect(player['name']).to.equal('name');
        expect(player['id']).to.equal('socketId');
        done();
    });

    it('Should return easel when calling getEasel', (done: Mocha.Done) => {
        const easel = createStubInstance(Easel);
        player['easel'] = easel;
        expect(player.getEasel()).to.equal(easel);
        done();
    });

    it('Should return if the player have these letters', (done: Mocha.Done) => {
        const spy = Sinon.spy(player['easel'], 'containsLetters');
        player.haveLetters([]);
        expect(spy.calledOnce);
        done();
    });

    it('Should update score of player', (done: Mocha.Done) => {
        player['score'] = 10;
        player.addScore(10);
        expect(player['score']).to.equal(20);
        done();
    });

    it('Should update score of player', (done: Mocha.Done) => {
        player['score'] = 10;
        player.addScore(-10);
        expect(player['score']).to.equal(10);
        done();
    });

    it('Should update score of player', (done: Mocha.Done) => {
        player['score'] = 10;
        player.removeScore(10);
        expect(player['score']).to.equal(0);
        done();
    });

    it('Should update score of player', (done: Mocha.Done) => {
        player['score'] = 10;
        player.removeScore(-10);
        expect(player['score']).to.equal(10);
        done();
    });

    it('Should add the score of the easel', (done: Mocha.Done) => {
        player['score'] = 0;
        const easel = createStubInstance(Easel);
        easel.getContent.returns([
            { letter: 'A', point: 1 },
            { letter: 'B', point: 2 },
            { letter: 'C', point: 3 },
        ]);
        player['easel'] = easel;
        player.addScoreFromEasel();
        expect(player['score']).to.equal(6);
        done();
    });

    it('Should add the score of the easel', (done: Mocha.Done) => {
        player['score'] = 0;
        const letters = [
            { letter: 'A', point: 1 },
            { letter: 'B', point: 2 },
            { letter: 'C', point: 3 },
        ];
        player.addScoreFromOtherEasel(letters);
        expect(player['score']).to.equal(6);
        done();
    });

    it('Should return the score of player', (done: Mocha.Done) => {
        player['score'] = 10;
        expect(player.getScore()).to.deep.equal(10);
        done();
    });
});
