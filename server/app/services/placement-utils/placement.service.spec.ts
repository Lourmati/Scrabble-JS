import { Box } from '@app/classes/grid/box';
/* eslint-disable @typescript-eslint/no-require-imports */
import { GridServer } from '@app/classes/grid/grid';
import { Multiplier } from '@app/classes/grid/multiplier';
import { Vec2 } from '@app/classes/grid/placement';
import { DEFAULT_DICTIONARY, DICTIONARIES_PATH } from '@app/constants/dictionary';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { cwd } from 'process';
import { PlacementService } from './placement.service';
import sinon = require('sinon');

describe('Placement', () => {
    let dictionaryServiceStub: sinon.SinonStubbedInstance<DictionaryService>;
    let placer: PlacementService;

    beforeEach(async () => {
        dictionaryServiceStub = sinon.createStubInstance(DictionaryService);
        dictionaryServiceStub.getDictionaryByGameId.returns(JSON.parse(readFileSync(cwd() + DICTIONARIES_PATH + '/' + DEFAULT_DICTIONARY, 'utf8')));
        placer = new PlacementService(dictionaryServiceStub);
    });

    // Process symbols
    it('should process words with accent', () => {
        const word = 'célèbre';
        const processedWord = placer.processSymbols(word);
        expect(processedWord).equal('celebre');
    });

    it('should process words with cedilla', () => {
        const word = 'leçon';
        const processedWord = placer.processSymbols(word);
        expect(processedWord).equal('lecon');
    });

    it('should process words with umlaut', () => {
        const word = 'noël';
        const processedWord = placer.processSymbols(word);
        expect(processedWord).equal('noel');
    });

    it('should process words with accent, cedilla or umlaut', () => {
        const word = 'çhïèn';
        const processedWord = placer.processSymbols(word);
        expect(processedWord).equal('chien');
    });

    it('should not change words without accent, cedilla or umlaut', () => {
        const word = 'sage';
        const processedWord = placer.processSymbols(word);
        expect(processedWord).equal(word);
    });

    // Is in grid bounds
    it('should be in grid bounds (between 1 and 15)', () => {
        expect(placer.isInGridBounds({ x: 5, y: 5 })).equal(true);
    });

    it('should be in grid bounds (x: 1 & y: 1)', () => {
        expect(placer.isInGridBounds({ x: 1, y: 1 })).equal(true);
    });

    it('should be in grid bounds (x: 15 & y: 15)', () => {
        expect(placer.isInGridBounds({ x: 15, y: 15 })).equal(true);
    });

    it('should not be in grid bounds (x < 1)', () => {
        expect(placer.isInGridBounds({ x: 0, y: 5 })).equal(false);
    });

    it('should not be in grid bounds (y < 1)', () => {
        expect(placer.isInGridBounds({ x: 5, y: 0 })).equal(false);
    });

    it('should not be in grid bounds (x > 15)', () => {
        expect(placer.isInGridBounds({ x: 16, y: 5 })).equal(false);
    });

    it('should not be in grid bounds (y > 15)', () => {
        expect(placer.isInGridBounds({ x: 5, y: 16 })).equal(false);
    });

    // Box is empty
    it('should not be empty', () => {
        const vec: Vec2 = { x: 5, y: 5 };
        const grid: GridServer = new GridServer();
        grid.boxes[vec.x][vec.y].value = 'a';

        expect(placer.boxIsEmpty(grid.boxes, vec)).equal(false);
    });

    it('should be empty', () => {
        const vec: Vec2 = { x: 5, y: 5 };
        const grid: GridServer = new GridServer();
        expect(placer.boxIsEmpty(grid.boxes, vec)).equal(true);
    });

    // Box Array to String Array
    it('should convert a boxArray to stringArray', () => {
        const boxN = { x: 1, y: 1, value: 'N', index: 1, multiplier: Multiplier.Basic, color: 'white', available: true };
        const boxE = { x: 1, y: 2, value: 'E', index: 2, multiplier: Multiplier.Basic, color: 'white', available: true };
        const firstWord: Box[] = [boxN, boxE];

        const boxA = { x: 1, y: 5, value: 'A', index: 5, multiplier: Multiplier.Basic, color: 'white', available: true };
        const boxU = { x: 1, y: 6, value: 'U', index: 6, multiplier: Multiplier.Basic, color: 'white', available: true };
        const secondWord: Box[] = [boxA, boxU];

        const boxArray: Box[][] = [firstWord, secondWord];

        const stringArray = placer.boxArrayToStringArray(boxArray);

        expect(stringArray[0]).equal('NE');
        expect(stringArray[1]).equal('AU');
    });
});
