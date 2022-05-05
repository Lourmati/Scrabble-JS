/* eslint-disable dot-notation */
import { ParseLettersService } from '@app/services/parse-letter/parse-letter.service';
import { expect } from 'chai';

describe('ParseLetters service', () => {
    let parseLettersService: ParseLettersService;
    beforeEach(async () => {
        parseLettersService = new ParseLettersService();
    });

    it('should get the score of a letter ', () => {
        const scoreA = parseLettersService['getLetterScore']('a');
        expect(scoreA).equal(1);
    });
    it('should returns an array of letter', () => {
        const letters = parseLettersService.parseLetters('abc');
        expect(letters[0].point).equal(1);
    });
    it('should returns an array of letter', () => {
        const letters = parseLettersService.parseLetters('');
        expect(letters).to.deep.equal([]);
    });
    it('should return undefined when getScoreLetter is called with not existing letter', () => {
        expect(parseLettersService['getLetterScore'](' ')).equal(0);
    });
});
