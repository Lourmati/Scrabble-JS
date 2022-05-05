/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable dot-notation */
import { Reserve } from '@app/classes/reserve/reserve';
import * as RESERVE from '@app/constants/reserve';
import { expect } from 'chai';

const RESERVE_SIZE = 102;
const RANDOM_THRESHOLD = 100;
const MOCK_LETTERS_COUNT = 7;
const MOCK_LETTERS = [
    { letter: 'A', point: 0 },
    { letter: 'A', point: 0 },
    { letter: 'B', point: 1 },
];

describe('Reserve', () => {
    let reserve: Reserve;

    beforeEach(() => {
        reserve = new Reserve();
    });

    it('Should assign the letters of the reserve to the attribute', (done: Mocha.Done) => {
        expect(reserve['letters']).to.deep.equal(RESERVE.LETTERS);
        done();
    });

    it('Should return the size of the reserve', (done: Mocha.Done) => {
        expect(reserve.getSize()).to.equal(RESERVE_SIZE);
        done();
    });

    it('Should return the size of the reserve', (done: Mocha.Done) => {
        const random = Math.floor(Math.random() * RANDOM_THRESHOLD);
        reserve['letters'] = new Array(random);
        expect(reserve.getSize()).to.equal(random);
        done();
    });

    it('Should return the content of the reserve', (done: Mocha.Done) => {
        expect(reserve.getContent()).to.deep.equal(RESERVE.LETTERS);
        done();
    });

    it('Should return the content of the reserve', (done: Mocha.Done) => {
        const array = new Array(RANDOM_THRESHOLD).map(() => {
            return {
                letter: Math.random().toString(),
                point: Math.random(),
            };
        });
        reserve['letters'] = array;
        expect(reserve.getContent()).to.deep.equal(array);
        done();
    });

    it('Should return the formatted content', (done: Mocha.Done) => {
        expect(reserve.getFormattedContent()).to.equal(
            'a : 9\nb : 2\nc : 2\nd : 3\ne : 15\nf : 2\ng : 2\nh : 2\ni : 8\nj : 1\nk : 1\nl : 5\nm : 3\nn : 6\no : 6\np : 2\nq : 1\nr : 6\ns : 6\nt : 6\nu : 6\nv : 2\nw : 1\nx : 1\ny : 1\nz : 1\n* : 2',
        );
        done();
    });

    it('Should return true if the reserve is empty', (done: Mocha.Done) => {
        expect(reserve.isEmpty()).to.be.false;
        done();
    });

    it('Should return true if the reserve is empty', (done: Mocha.Done) => {
        reserve['letters'] = [];
        expect(reserve.isEmpty()).to.be.true;
        done();
    });

    it('Should add letters to the reserve', (done: Mocha.Done) => {
        reserve.addLetters(MOCK_LETTERS);
        expect(reserve['letters']).to.deep.equal([...RESERVE.LETTERS, ...MOCK_LETTERS]);
        done();
    });

    it('Should add letters to the reserve', (done: Mocha.Done) => {
        reserve['letters'] = [];
        reserve.addLetters(MOCK_LETTERS);
        expect(reserve['letters']).to.deep.equal(MOCK_LETTERS);
        done();
    });

    it('Should remove random letters from the reserve', (done: Mocha.Done) => {
        const array = reserve.removeRandomLetters(MOCK_LETTERS_COUNT);
        expect(array).to.be.an('array');
        expect(array).to.have.lengthOf(MOCK_LETTERS_COUNT);
        done();
    });

    it('Should return the object entries (Polyfill of Object.entries)', (done: Mocha.Done) => {
        expect(
            reserve['objectEntriesPolyfill']({
                a: 1,
                b: 2,
                c: 3,
            }),
        ).to.deep.equal([
            ['a', 1],
            ['b', 2],
            ['c', 3],
        ]);
        done();
    });
});
