/* eslint-disable @typescript-eslint/no-require-imports */
import { GridServer } from '@app/classes/grid/grid';
import { Placement } from '@app/classes/grid/placement';
import { DEFAULT_DICTIONARY, DICTIONARIES_PATH } from '@app/constants/dictionary';
import { MAX_SCORE } from '@app/constants/virtual-player';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { PointsCalculatorService } from '@app/services/placement-points-calculator/points-calculator.service';
import { PlacementService } from '@app/services/placement-utils/placement.service';
import { PlacementValidationService } from '@app/services/placement-validation/placement-validation.service';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { cwd } from 'process';
import { PlacementGeneratorService } from './placement-generator.service';
import sinon = require('sinon');

describe('Placement Generator', () => {
    let dictionaryServiceStub: sinon.SinonStubbedInstance<DictionaryService>;
    let generator: PlacementGeneratorService;
    let validator: PlacementValidationService;
    let calculator: PointsCalculatorService;
    let placer: PlacementService;

    beforeEach(async () => {
        dictionaryServiceStub = sinon.createStubInstance(DictionaryService);
        dictionaryServiceStub.getDictionaryByGameId.returns(JSON.parse(readFileSync(cwd() + DICTIONARIES_PATH + '/' + DEFAULT_DICTIONARY, 'utf8')));

        placer = new PlacementService(dictionaryServiceStub);
        calculator = new PointsCalculatorService();
        validator = new PlacementValidationService(placer, calculator, dictionaryServiceStub);
        generator = new PlacementGeneratorService(placer, validator, dictionaryServiceStub);
    });
    // Generate placements
    it('should generate 1 placement (letters on grid horizontal)', () => {
        const maxScore = 6;
        const grid: GridServer = new GridServer();
        grid.boxes[4][5].value = 'c';
        grid.boxes[4][6].value = 'h';
        grid.boxes[4][7].value = 'e';
        const placements: Placement[] = generator.generatePlacements('id', {
            easel: ['v', 'c', 'e'],
            grid: grid.boxes,
            isGridEmpty: false,
            constraints: { minScore: 0, maxScore },
        });

        const placementData = validator.isPlacementValid('id', grid.boxes, placements[0], false);

        expect(placementData.score >= 0 && placementData.score <= maxScore).equal(true);
        expect(placementData.validity).equal(true);

        expect(placements.length === 1).equal(true);
    });
    it('should generate 1 placement (letters on grid vertical)', () => {
        const maxScore = 12;
        const grid: GridServer = new GridServer();
        grid.boxes[5][4].value = 'c';
        grid.boxes[6][4].value = 'h';
        grid.boxes[7][4].value = 'e';
        const placements: Placement[] = generator.generatePlacements('id', {
            easel: ['v', 'c', 'e'],
            grid: grid.boxes,
            isGridEmpty: false,
            constraints: { minScore: 0, maxScore },
        });

        const placementData = validator.isPlacementValid('id', grid.boxes, placements[0], false);

        expect(placementData.score >= 0 && placementData.score <= maxScore).equal(true);
        expect(placementData.validity).equal(true);

        expect(placements.length === 1).equal(true);
    });
    it('should generate 1 placement (empty tiles between letters horizontal)', () => {
        const maxScore = 12;
        const grid: GridServer = new GridServer();
        grid.boxes[4][4].value = 'e';
        grid.boxes[4][8].value = 'c';
        const placements: Placement[] = generator.generatePlacements('id', {
            easel: ['h', 'e', 'c'],
            grid: grid.boxes,
            isGridEmpty: false,
            constraints: { minScore: 0, maxScore },
        });

        const placementData = validator.isPlacementValid('id', grid.boxes, placements[0], false);

        expect(placementData.score >= 0 && placementData.score <= maxScore).equal(true);
        expect(placementData.validity).equal(true);

        expect(placements.length === 1).equal(true);
    });

    it('should not generate 1 placement (any placement between the min & max score)', () => {
        const grid: GridServer = new GridServer();
        grid.boxes[4][4].value = 'e';
        grid.boxes[4][8].value = 'c';
        const placements: Placement[] = generator.generatePlacements('id', {
            easel: ['h', 'e', 'c'],
            grid: grid.boxes,
            isGridEmpty: false,
            constraints: { minScore: 13, maxScore: 18 },
        });

        expect(placements.length === 0).equal(true);
    });

    it('should generate placements (empty tiles between 7 letters horizontal - worst case scenario)', () => {
        const grid: GridServer = new GridServer();
        grid.boxes[4][4].value = 's';
        grid.boxes[4][6].value = 'l';
        grid.boxes[4][7].value = 'u';
        grid.boxes[4][10].value = 'o';
        const placements: Placement[] = generator.generatePlacements('id', {
            easel: ['s', 'o', 'l', 'u', 't', 'i', 'n'],
            grid: grid.boxes,
            isGridEmpty: false,
        });

        const firstPlacementData = validator.isPlacementValid('id', grid.boxes, placements[0], false);
        const secondPlacementData = validator.isPlacementValid('id', grid.boxes, placements[1], false);
        const thirdPlacementData = validator.isPlacementValid('id', grid.boxes, placements[2], false);

        expect(firstPlacementData.validity).equal(true);
        expect(secondPlacementData.validity).equal(true);
        expect(thirdPlacementData.validity).equal(true);

        expect(placements.length === 3).equal(true);
    });

    it('should generate placements (easel contains 2 letters)', () => {
        const grid: GridServer = new GridServer();
        grid.boxes[4][4].value = 'b';
        const placements: Placement[] = generator.generatePlacements('id', {
            easel: ['a', 'c'],
            grid: grid.boxes,
            isGridEmpty: false,
        });

        const firstPlacementData = validator.isPlacementValid('id', grid.boxes, placements[0], false);
        const secondPlacementData = validator.isPlacementValid('id', grid.boxes, placements[1], false);
        const thirdPlacementData = validator.isPlacementValid('id', grid.boxes, placements[2], false);

        expect(firstPlacementData.validity).equal(true);
        expect(secondPlacementData.validity).equal(true);
        expect(thirdPlacementData.validity).equal(true);

        expect(placements.length === 3).equal(true);
    });

    it('should generate placements (first placement)', () => {
        const grid: GridServer = new GridServer();
        const placements: Placement[] = generator.generatePlacements('id', {
            easel: ['a', 'c', 'm', 'p', 'o', 'r', 'i'],
            grid: grid.boxes,
            isGridEmpty: true,
        });

        const firstPlacementData = validator.isPlacementValid('id', grid.boxes, placements[0], false);
        const secondPlacementData = validator.isPlacementValid('id', grid.boxes, placements[1], false);
        const thirdPlacementData = validator.isPlacementValid('id', grid.boxes, placements[2], false);

        expect(firstPlacementData.validity).equal(true);
        expect(secondPlacementData.validity).equal(true);
        expect(thirdPlacementData.validity).equal(true);
        expect(placements.length === 3).equal(true);
    });

    it('should not generate placements (0 letters)', () => {
        const grid: GridServer = new GridServer();
        grid.boxes[4][4].value = 's';
        grid.boxes[4][6].value = 'l';
        grid.boxes[4][7].value = 'u';
        grid.boxes[4][10].value = 'o';
        const placements: Placement[] = generator.generatePlacements('id', {
            easel: [],
            grid: grid.boxes,
            isGridEmpty: false,
        });

        expect(placements.length === 0).equal(true);
    });

    it('should generate placement for max score (7 letters in easel)', () => {
        const grid: GridServer = new GridServer();
        grid.boxes[4][4].value = 'e';
        grid.boxes[4][8].value = 'c';
        grid.boxes[5][5].value = 'r';

        const placements: Placement[] = generator.generatePlacements('id', {
            easel: ['r', 'e', 'c', 'a', 'm', 'h', 'o'],
            grid: grid.boxes,
            isGridEmpty: false,
            constraints: { minScore: 0, maxScore: MAX_SCORE },
        });

        const placementData = validator.isPlacementValid('id', grid.boxes, placements[0], false);

        expect(placementData.score >= 0 && placementData.score <= MAX_SCORE).equal(true);
        expect(placementData.validity).equal(true);

        expect(placements.length === 1).equal(true);
    });
});
