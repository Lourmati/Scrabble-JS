/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable dot-notation */
import { Objective } from '@app/classes/objective/objective';
import { ObjectiveType } from '@app/classes/objective/objective-type';
import { ObjectivesManagerService } from '@app/services/objectives-manager/objectives-manager.service';
import { expect } from 'chai';
import Sinon = require('sinon');
// eslint-disable-next-line @typescript-eslint/no-require-imports
// import Sinon = require('sinon');

const OBJECTIVES_NUMBER = 4;

describe('Objectives Manager service', () => {
    let objectivesService: ObjectivesManagerService;
    beforeEach(async () => {
        objectivesService = new ObjectivesManagerService();
    });

    it('should return a random value between 0 and the size ', () => {
        const value = 10;
        let isValid = true;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let index = 0; index < 100; index++) {
            const randValue = objectivesService.getRandomNumber(value);
            if (!(typeof randValue === 'number' && randValue >= 0 && randValue <= value)) isValid = false;
        }
        expect(isValid).to.equals(true);
    });

    it('should call getRandomNumber when getRandomObjectives is called', () => {
        const objectives: Objective[] = objectivesService.getRandomObjectives();
        expect(objectives.length).to.equals(OBJECTIVES_NUMBER);
    });

    it('should call setPrivateObjectives when getGameObjectives is called', () => {
        const spy = Sinon.spy(objectivesService, 'setPrivateObjectives');
        objectivesService.getGameObjectives();
        expect(spy.calledOnce);
    });

    it('Should check if objective is choosen', () => {
        const objectives: Objective[] = objectivesService.getRandomObjectives();
        const objective = objectives[0];
        expect(objectivesService.isObjectiveChoosen(objective, objectives)).to.be.true;
    });

    it('Should check if objective is choosen', () => {
        const objectives: Objective[] = objectivesService.getRandomObjectives();
        const objective: Objective = {
            id: '1',
            title: 'Objectif 1',
            description: 'Description 1',
            type: ObjectiveType.PUBLIC,
            points: 0,
            checked: false,
            done: false,
            code: 0,
        };
        expect(objectivesService.isObjectiveChoosen(objective, objectives)).to.be.false;
    });
});
