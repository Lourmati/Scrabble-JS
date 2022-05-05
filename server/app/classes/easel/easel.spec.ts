/* eslint-disable dot-notation */
import { Letter } from '@app/classes/common/letter';
import { Easel } from '@app/classes/easel/easel';
import { expect } from 'chai';
import { describe } from 'mocha';

const MOCK_LETTERS_1: Letter[] = [
    { letter: 'A', point: 1 },
    { letter: 'A', point: 1 },
    { letter: 'C', point: 3 },
];

const MOCK_LETTERS_SCORE_1 = 5;

const MOCK_LETTERS_2: Letter[] = [
    { letter: 'A', point: 1 },
    { letter: 'A', point: 1 },
    { letter: 'A', point: 1 },
    { letter: 'B', point: 2 },
    { letter: 'C', point: 3 },
    { letter: 'C', point: 3 },
    { letter: 'D', point: 4 },
];

const MOCK_LETTERS_SCORE_2 = 15;

const MOCK_LETTERS_3: Letter[] = [];

const MOCK_LETTERS_4: Letter[] = [
    { letter: 'A', point: 1 },
    { letter: 'A', point: 1 },
    { letter: 'E', point: 5 },
];

const MOCK_LETTERS_5: Letter[] = [
    { letter: 'A', point: 1 },
    { letter: 'B', point: 2 },
    { letter: 'C', point: 3 },
    { letter: 'D', point: 4 },
];

const MOCK_LETTERS_6: Letter[] = [
    { letter: 'A', point: 1 },
    { letter: 'A', point: 1 },
    { letter: 'A', point: 1 },
    { letter: 'A', point: 1 },
];

describe('Easel', () => {
    let easel: Easel;

    beforeEach(async () => {
        easel = new Easel([]);
    });

    /**
     * easel.getSize()
     */

    it('Should return the size of the easel (MOCK_LETTERS_1)', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_1;
        expect(easel.getSize()).to.equal(MOCK_LETTERS_1.length);
        done();
    });

    it('Should return the size of the easel (MOCK_LETTERS_2)', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_2;
        expect(easel.getSize()).to.equal(MOCK_LETTERS_2.length);
        done();
    });

    it('Should return the size of the easel (MOCK_LETTERS_3)', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_3;
        expect(easel.getSize()).to.equal(MOCK_LETTERS_3.length);
        done();
    });

    /**
     * easel.containsLetter()
     */

    it('Should return true if the easel contains these letters', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_2;
        expect(easel.containsLetters(MOCK_LETTERS_2)).to.equal(true);
        done();
    });

    it('Should return true if the easel contains these letters', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_2;
        expect(easel.containsLetters(MOCK_LETTERS_1)).to.equal(true);
        done();
    });

    it('Should return false if the easel does not contain these letters', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_2;
        expect(easel.containsLetters(MOCK_LETTERS_6)).to.equal(false);
        done();
    });

    it('Should return false if the easel does not contain these letters', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_2;
        expect(easel.containsLetters([{ letter: 'W', point: 10 }])).to.equal(false);
        done();
    });

    it('Should return false if the easel does not contain these letters', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_2;
        expect(easel.containsLetters([...MOCK_LETTERS_1, ...MOCK_LETTERS_1])).to.equal(false);
        done();
    });

    /**
     * easel.getContent()
     */

    it('Should return the easel content', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_1;
        expect(easel.getContent()).to.deep.equal(MOCK_LETTERS_1);
        done();
    });

    it('Should return the easel content', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_2;
        expect(easel.getContent()).to.deep.equal(MOCK_LETTERS_2);
        done();
    });

    it('Should return the easel content', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_3;
        expect(easel.getContent()).to.deep.equal(MOCK_LETTERS_3);
        done();
    });

    /**
     * easel.getContentAsString()
     */

    it('Should return the easel content', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_1;
        expect(easel.getContentAsString()).to.deep.equal(['A', 'A', 'C']);
        done();
    });

    it('Should return the easel content', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_2;
        expect(easel.getContentAsString()).to.deep.equal(['A', 'A', 'A', 'B', 'C', 'C', 'D']);
        done();
    });

    it('Should return the easel content', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_3;
        expect(easel.getContentAsString()).to.deep.equal([]);
        done();
    });

    /**
     * easel.isEmpty()
     */

    it('Should return false if the easel is not empty', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_1;
        expect(easel.isEmpty()).to.equal(false);
        done();
    });

    it('Should return false if the easel is not empty', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_2;
        expect(easel.isEmpty()).to.equal(false);
        done();
    });

    it('Should return true if the easel is empty', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_3;
        expect(easel.isEmpty()).to.equal(true);
        done();
    });

    /**
     * easel.addLetters()
     */

    it('Should add the letters', (done: Mocha.Done) => {
        easel['letters'] = [...MOCK_LETTERS_1];
        easel.addLetters(MOCK_LETTERS_4);
        expect(easel['letters']).to.deep.equal([...MOCK_LETTERS_1, ...MOCK_LETTERS_4]);
        done();
    });

    it('Should add the letters', (done: Mocha.Done) => {
        easel['letters'] = [...MOCK_LETTERS_1];
        easel.addLetters(MOCK_LETTERS_3);
        expect(easel['letters']).to.deep.equal(MOCK_LETTERS_1);
        done();
    });

    it('Should add the letters', (done: Mocha.Done) => {
        easel['letters'] = [...MOCK_LETTERS_2];
        easel.addLetters(MOCK_LETTERS_1);
        expect(easel['letters']).to.deep.equal(MOCK_LETTERS_2);
        done();
    });

    /**
     * easel.removeLetters()
     */

    it('Should remove the letters', (done: Mocha.Done) => {
        easel['letters'] = [...MOCK_LETTERS_2];
        easel.removeLetters(MOCK_LETTERS_1);
        expect(easel['letters']).to.deep.equal(MOCK_LETTERS_5);
        done();
    });

    it('Should remove the letters', (done: Mocha.Done) => {
        easel['letters'] = [...MOCK_LETTERS_2];
        easel.removeLetters(MOCK_LETTERS_3);
        expect(easel['letters']).to.deep.equal(MOCK_LETTERS_2);
        done();
    });

    it('Should remove the letters', (done: Mocha.Done) => {
        easel['letters'] = [...MOCK_LETTERS_1];
        easel.removeLetters(MOCK_LETTERS_4);
        expect(easel['letters']).to.deep.equal([{ letter: 'C', point: 3 }]);
        done();
    });

    /**
     * easel.getScore()
     */

    it('Should return the sum of the point of letters', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_1;
        expect(easel.getScore()).to.equal(MOCK_LETTERS_SCORE_1);
        done();
    });

    it('Should return the sum of the point of letters', (done: Mocha.Done) => {
        easel['letters'] = MOCK_LETTERS_2;
        expect(easel.getScore()).to.equal(MOCK_LETTERS_SCORE_2);
        done();
    });
});
