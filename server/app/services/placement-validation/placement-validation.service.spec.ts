/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable max-lines */
import { AXIS } from '@app/classes/grid/axis';
import { GridServer } from '@app/classes/grid/grid';
import { Placement } from '@app/classes/grid/placement';
import { DEFAULT_DICTIONARY, DICTIONARIES_PATH } from '@app/constants/dictionary';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { PointsCalculatorService } from '@app/services/placement-points-calculator/points-calculator.service';
import { PlacementService } from '@app/services/placement-utils/placement.service';
import { PlacementValidationService } from '@app/services/placement-validation/placement-validation.service';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { cwd } from 'process';
import sinon = require('sinon');

describe('Placement Validation', () => {
    let dictionaryServiceStub: sinon.SinonStubbedInstance<DictionaryService>;
    let validationService: PlacementValidationService;
    let placer: PlacementService;
    let calculator: PointsCalculatorService;
    let grid: GridServer;

    beforeEach(async () => {
        dictionaryServiceStub = sinon.createStubInstance(DictionaryService);
        dictionaryServiceStub.getDictionaryByGameId.returns(JSON.parse(readFileSync(cwd() + DICTIONARIES_PATH + '/' + DEFAULT_DICTIONARY, 'utf8')));
        placer = new PlacementService(dictionaryServiceStub);
        calculator = new PointsCalculatorService();
        validationService = new PlacementValidationService(placer, calculator, dictionaryServiceStub);
        grid = new GridServer();
    });

    // Check composition
    it('should be invalid if the word contains apostrophe', () => {
        const word = "aujourd'hui";
        const isValid = validationService.checkComposition(word);
        expect(isValid).equal(false);
    });

    it('should be invalid if the word contains hyphen', () => {
        const word = 'soi-disant';
        const isValid = validationService.checkComposition(word);
        expect(isValid).equal(false);
    });

    it('should be invalid if the word contains apostrophe and hyphen', () => {
        const word = "c'est-à-dire";
        const isValid = validationService.checkComposition(word);
        expect(isValid).equal(false);
    });

    it('should be valid if the word does not contains apostrophe and hyphen', () => {
        const word = 'pomme';
        const isValid = validationService.checkComposition(word);
        expect(isValid).equal(true);
    });

    // Check word length
    it('should be valid if the word length is greater than 2', () => {
        const word = 'pomme';
        const isValid = validationService.checkWordLength(word);
        expect(isValid).equal(true);
    });

    it('should be valid if the word length is equal to 2', () => {
        const word = 'la';
        const isValid = validationService.checkWordLength(word);
        expect(isValid).equal(true);
    });

    it('should be invalid if the word length (1) is lower to 2', () => {
        const word = 'l';
        const isValid = validationService.checkWordLength(word);
        expect(isValid).equal(false);
    });

    it('should be invalid if the word length is an empty string', () => {
        const word = '';
        const isValid = validationService.checkWordLength(word);
        expect(isValid).equal(false);
    });

    // Check dictionary
    it('should exist in the dictionary', () => {
        const word = 'hexagone';
        const isInDictionary = validationService.checkDictionary('id', word);
        expect(isInDictionary).equal(true);
    });

    it('should not exist in the dictionary', () => {
        const word = 'shawarma';
        const isInDictionary = validationService.checkDictionary('id', word);
        expect(isInDictionary).equal(false);
    });

    it('should not exist in the dictionary (word with number)', () => {
        const word = '4mi';
        const isInDictionary = validationService.checkDictionary('id', word);
        expect(isInDictionary).equal(false);
    });

    // Validate horizontal word
    it('should detect 0 valid horizontal word', () => {
        const placement: Placement = { letters: 'a', position: { x: 5, y: 6 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(false);
        expect(placementData.placedWords.length).equal(0);
    });

    it('should detect 0 valid horizontal word because of hyphen', () => {
        const placement: Placement = { letters: 'a-p', position: { x: 5, y: 6 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(false);
        expect(placementData.placedWords.length).equal(0);
    });

    it('should detect 1 valid horizontal word (1 letter placed)', () => {
        grid.boxes[5][5].value = 'p';
        grid.boxes[5][7].value = 'r';
        grid.boxes[5][8].value = 'c';
        const placement: Placement = { letters: 'a', position: { x: 5, y: 6 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('parc');
    });

    it('should detect 1 valid horizontal word (2 letters placed)', () => {
        grid.boxes[2][2].value = 'e';
        grid.boxes[2][4].value = 'h';
        grid.boxes[2][6].value = 'c';
        const placement: Placement = { letters: 'ce', position: { x: 2, y: 3 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('echec');
    });

    it('should detect 1 valid horizontal word (3 letters placed)', () => {
        grid.boxes[9][9].value = 'b';
        grid.boxes[9][10].value = 'a';
        grid.boxes[9][13].value = 'n';
        const placement: Placement = { letters: 'nàe', position: { x: 9, y: 11 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('banane');
    });

    it('should detect 1 valid horizontal word (4 letters placed)', () => {
        grid.boxes[11][9].value = 'v';
        grid.boxes[11][11].value = 'i';
        grid.boxes[11][13].value = 'u';
        const placement: Placement = { letters: 'otre', position: { x: 11, y: 10 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('voiture');
    });

    it('should detect 1 valid horizontal word (5 letters placed)', () => {
        grid.boxes[15][10].value = 'e';
        const placement: Placement = { letters: 'orang', position: { x: 15, y: 5 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('orange');
    });

    it('should detect 1 valid horizontal word (6 letters placed)', () => {
        grid.boxes[15][3].value = 'n';
        grid.boxes[15][7].value = 'r';
        grid.boxes[15][10].value = 't';
        grid.boxes[15][11].value = 'e';
        const placement: Placement = { letters: 'uivesi', position: { x: 15, y: 2 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('universite');
    });

    it('should detect 1 valid horizontal word (7 letters placed)', () => {
        const placement: Placement = { letters: 'tomates', position: { x: 1, y: 1 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('tomates');
    });

    // Validate vertical word
    it('should detect 0 valid vertical word', () => {
        const placement: Placement = { letters: 'a', position: { x: 6, y: 5 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(false);
        expect(placementData.placedWords.length).equal(0);
    });

    it('should detect 1 valid vertical word (1 letter placed)', () => {
        grid.boxes[5][5].value = 'p';
        grid.boxes[7][5].value = 'r';
        grid.boxes[8][5].value = 'c';
        const placement: Placement = { letters: 'a', position: { x: 6, y: 5 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('parc');
    });

    it('should detect 1 valid vertical word (2 letters placed)', () => {
        grid.boxes[2][2].value = 'e';
        grid.boxes[4][2].value = 'h';
        grid.boxes[6][2].value = 'c';
        const placement: Placement = { letters: 'ce', position: { x: 3, y: 2 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('echec');
    });

    it('should detect 1 valid vertical word (3 letters placed)', () => {
        grid.boxes[9][9].value = 'b';
        grid.boxes[10][9].value = 'a';
        grid.boxes[13][9].value = 'n';
        const placement: Placement = { letters: 'nae', position: { x: 11, y: 9 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('banane');
    });

    it('should detect 1 valid vertical word (4 letters placed)', () => {
        grid.boxes[9][11].value = 'v';
        grid.boxes[11][11].value = 'i';
        grid.boxes[13][11].value = 'u';
        const placement: Placement = { letters: 'otre', position: { x: 10, y: 11 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('voiture');
    });

    it('should detect 1 valid vertical word (5 letters placed)', () => {
        grid.boxes[10][15].value = 'e';
        const placement: Placement = { letters: 'orang', position: { x: 5, y: 15 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('orange');
    });

    it('should detect 1 valid vertical word (6 letters placed)', () => {
        grid.boxes[3][15].value = 'n';
        grid.boxes[7][15].value = 'r';
        grid.boxes[10][15].value = 't';
        grid.boxes[11][15].value = 'e';
        const placement: Placement = { letters: 'uivesi', position: { x: 2, y: 15 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('universite');
    });

    it('should detect 1 valid vertical word (7 letters placed)', () => {
        const placement: Placement = { letters: 'tomates', position: { x: 1, y: 1 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        expect(placementData.validity).equal(true);
        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('tomates');
    });

    // Validate multiple words
    it('should detect 1 horizontal word and 1 vertical word', () => {
        grid.boxes[3][2].value = 'p';
        grid.boxes[3][4].value = 'r';
        grid.boxes[3][5].value = 'c';
        grid.boxes[2][3].value = 's';
        grid.boxes[4][3].value = 'l';
        grid.boxes[5][3].value = 'e';
        grid.boxes[4][5].value = 'a';
        grid.boxes[5][5].value = 'n';
        grid.boxes[6][5].value = 'n';
        grid.boxes[7][5].value = 'e';
        const placement: Placement = { letters: 'a', position: { x: 3, y: 3 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);

        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('parc');
        expect(placer.boxArrayToString(placementData.placedWords[1])).equal('sale');
        expect(placementData.validity).equal(true);
    });

    it('should detect 1 horizontal word and 2 vertical words', () => {
        grid.boxes[3][2].value = 'p';
        grid.boxes[3][4].value = 'r';
        grid.boxes[2][3].value = 's';
        grid.boxes[4][3].value = 'l';
        grid.boxes[5][3].value = 'e';
        grid.boxes[4][5].value = 'a';
        grid.boxes[5][5].value = 'n';
        grid.boxes[6][5].value = 'n';
        grid.boxes[7][5].value = 'e';
        const placement: Placement = { letters: 'ac', position: { x: 3, y: 3 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);

        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('parc');
        expect(placer.boxArrayToString(placementData.placedWords[1])).equal('sale');
        expect(placer.boxArrayToString(placementData.placedWords[2])).equal('canne');
        expect(placementData.validity).equal(true);
    });

    it('should detect 1 vertical word and 1 horizontal word', () => {
        grid.boxes[2][3].value = 'p';
        grid.boxes[4][3].value = 'r';
        grid.boxes[5][3].value = 'c';
        grid.boxes[3][2].value = 's';
        grid.boxes[3][4].value = 'l';
        grid.boxes[3][5].value = 'e';
        grid.boxes[5][4].value = 'a';
        grid.boxes[5][5].value = 'n';
        grid.boxes[5][6].value = 'n';
        grid.boxes[5][7].value = 'e';
        const placement: Placement = { letters: 'a', position: { x: 3, y: 3 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);

        expect(placer.boxArrayToString(placementData.placedWords[0])).equal('parc');
        expect(placer.boxArrayToString(placementData.placedWords[1])).equal('sale');
        expect(placementData.validity).equal(true);
    });

    it('should detect 1 vertical word and 2 horizontal words', () => {
        grid.boxes[2][3].value = 'p';
        grid.boxes[4][3].value = 'r';
        grid.boxes[3][2].value = 's';
        grid.boxes[3][4].value = 'l';
        grid.boxes[3][5].value = 'e';
        grid.boxes[5][4].value = 'a';
        grid.boxes[5][5].value = 'n';
        grid.boxes[5][6].value = 'n';
        grid.boxes[5][7].value = 'e';
        const placement: Placement = { letters: 'a', position: { x: 3, y: 3 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);

        expect(placementData.validity).equal(true);
    });

    // IsPlacementValid
    it('should place , falsethe horizontal letter (valid placement)', () => {
        grid.boxes[5][5].value = 'p';
        grid.boxes[5][7].value = 'r';
        grid.boxes[5][8].value = 'c';
        const placement: Placement = { letters: 'a', position: { x: 5, y: 6 }, axis: AXIS.HORIZONTAL };

        if (validationService.isPlacementValid('id', grid.boxes, placement, false)) {
            grid.boxes = placer.placeLetters(grid.boxes, placement).boxes;
        }

        expect(grid.boxes[5][6].value === 'a').equal(true);
    });

    it('should not place the letter if the tile is already occupied', () => {
        grid.boxes[8][8].value = 'd';
        grid.boxes[8][9].value = 'e';
        grid.boxes[8][10].value = 'c';

        const placement: Placement = { letters: 'la', position: { x: 8, y: 8 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);

        expect(placementData.validity).equal(false);
    });

    it('should not place the letter (position out of bounds)', () => {
        const placement: Placement = { letters: 'z', position: { x: 0, y: 17 }, axis: AXIS.HORIZONTAL };

        if (validationService.isPlacementValid('id', grid.boxes, placement, false)) {
            grid.boxes = placer.placeLetters(grid.boxes, placement).boxes;
        }

        expect(grid.boxes[5][6].value === 'z').equal(false);
    });

    it('should not place the letters (first placement wrong coordinates)', () => {
        const placement: Placement = { letters: 'bon', position: { x: 11, y: 11 }, axis: AXIS.HORIZONTAL };

        if (validationService.isPlacementValid('id', grid.boxes, placement, true)) grid.boxes = placer.placeLetters(grid.boxes, placement).boxes;

        expect(grid.boxes[8][8].value === 'b').equal(false);
        expect(grid.boxes[8][9].value === 'o').equal(false);
        expect(grid.boxes[8][10].value === 'n').equal(false);
    });

    it('should not place the letters (first placement wrong x)', () => {
        const placement: Placement = { letters: 'bon', position: { x: 11, y: 8 }, axis: AXIS.HORIZONTAL };

        if (validationService.isPlacementValid('id', grid.boxes, placement, true)) grid.boxes = placer.placeLetters(grid.boxes, placement).boxes;

        expect(grid.boxes[8][8].value === 'b').equal(false);
        expect(grid.boxes[8][9].value === 'o').equal(false);
        expect(grid.boxes[8][10].value === 'n').equal(false);
    });

    it('should not place the letters (first placement wrong y)', () => {
        const placement: Placement = { letters: 'bon', position: { x: 8, y: 11 }, axis: AXIS.HORIZONTAL };

        if (validationService.isPlacementValid('id', grid.boxes, placement, true)) grid.boxes = placer.placeLetters(grid.boxes, placement).boxes;

        expect(grid.boxes[8][8].value === 'b').equal(false);
        expect(grid.boxes[8][9].value === 'o').equal(false);
        expect(grid.boxes[8][10].value === 'n').equal(false);
    });

    it('should place the letters (first placement good coordinates)', () => {
        const placement: Placement = { letters: 'bon', position: { x: 8, y: 8 }, axis: AXIS.HORIZONTAL };

        if (validationService.isPlacementValid('id', grid.boxes, placement, true)) grid.boxes = placer.placeLetters(grid.boxes, placement).boxes;

        expect(grid.boxes[8][8].value === 'b').equal(true);
        expect(grid.boxes[8][9].value === 'o').equal(true);
        expect(grid.boxes[8][10].value === 'n').equal(true);
    });
});
