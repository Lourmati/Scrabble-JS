/* eslint-disable @typescript-eslint/no-require-imports */
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

describe('Placement Points Calculator', () => {
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

    it('should calculate expected points for BALLE', () => {
        const expectedPoints = 20;
        const placement: Placement = { letters: 'balle', position: { x: 4, y: 8 }, axis: AXIS.HORIZONTAL };

        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        const actualPoints = placementData.score;

        expect(actualPoints).equal(expectedPoints);
    });

    it('should calculate expected points for VENTRE & VAS', () => {
        const expectedPoints = 30;

        grid.boxes[4][5].value = 'e';
        grid.boxes[4][6].value = 'n';
        grid.boxes[4][7].value = 't';
        grid.boxes[4][8].value = 'r';
        grid.boxes[4][9].value = 'e';
        grid.boxes[5][4].value = 'a';
        grid.boxes[5][6].value = 'u';
        grid.boxes[5][9].value = 't';
        grid.boxes[5][10].value = 'a';
        grid.boxes[5][11].value = 'l';
        grid.boxes[6][4].value = 's';
        grid.boxes[6][5].value = 'e';
        grid.boxes[6][6].value = 'l';

        const placement: Placement = { letters: 'v', position: { x: 4, y: 4 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        const actualPoints = placementData.score;

        expect(actualPoints).equal(expectedPoints);
    });

    it('should calculate expected points for ADONNERAI & GAREE', () => {
        const expectedPoints = 50;
        grid.boxes[12][5].value = 'd';
        grid.boxes[12][6].value = 'o';
        grid.boxes[12][7].value = 'n';
        grid.boxes[11][6].value = 'l';
        grid.boxes[11][9].value = 'e';
        grid.boxes[10][6].value = 'l';
        grid.boxes[10][7].value = 'u';
        grid.boxes[10][8].value = 'i';
        grid.boxes[10][9].value = 'r';
        grid.boxes[10][10].value = 'e';
        grid.boxes[9][6].value = 'a';
        grid.boxes[9][9].value = 'a';
        grid.boxes[8][8].value = 'e';
        grid.boxes[8][9].value = 'g';
        grid.boxes[8][10].value = 'o';

        const placement: Placement = { letters: 'anerai', position: { x: 12, y: 4 }, axis: AXIS.HORIZONTAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        const actualPoints = placementData.score;
        expect(actualPoints).equal(expectedPoints);
    });

    it('should calculate expected points for BETISES, DE, ET, RIT, OSAIT, BEC & ES', () => {
        const expectedPoints = 97;
        grid.boxes[7][10].value = 'd';
        grid.boxes[8][10].value = 'e';
        grid.boxes[9][10].value = 'r';
        grid.boxes[10][10].value = 'o';
        grid.boxes[11][10].value = 'b';
        grid.boxes[12][10].value = 'e';
        grid.boxes[9][12].value = 't';
        grid.boxes[10][12].value = 'a';
        grid.boxes[11][12].value = 'c';
        grid.boxes[10][13].value = 'i';
        grid.boxes[10][14].value = 't';

        const placement: Placement = { letters: 'betises', position: { x: 6, y: 11 }, axis: AXIS.VERTICAL };
        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        const actualPoints = placementData.score;

        expect(actualPoints).equal(expectedPoints);
    });

    it('should calculate expected points for PARC (1 WORDx3)', () => {
        const expectedPoints = 24;
        const placement: Placement = { letters: 'parc', position: { x: 1, y: 5 }, axis: AXIS.HORIZONTAL };

        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        const actualPoints = placementData.score;
        expect(actualPoints).equal(expectedPoints);
    });

    it('should calculate points and return expected points for MOT (1 LETTERx3)', () => {
        const expectedPoints = 6;
        const placement: Placement = { letters: 'mot', position: { x: 2, y: 4 }, axis: AXIS.HORIZONTAL };

        const placementData = validationService.isPlacementValid('id', grid.boxes, placement, false);
        const actualPoints = placementData.score;

        expect(actualPoints).equal(expectedPoints);
    });
});
