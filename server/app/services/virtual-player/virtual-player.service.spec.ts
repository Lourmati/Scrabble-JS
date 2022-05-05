/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable dot-notation */
import { Easel } from '@app/classes/easel/easel';
import { Game } from '@app/classes/game/game';
import { AXIS } from '@app/classes/grid/axis';
import { GridServer } from '@app/classes/grid/grid';
import { Placement } from '@app/classes/grid/placement';
import { PlacementRequest } from '@app/classes/placement/placement-request';
import { Player } from '@app/classes/player/player';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { MAX_THRESHOLD_MS, MIN_THRESHOLD_MS } from '@app/constants/virtual-player';
import { VirtualPlayerNamesService } from '@app/database/virtual-player/virtual-player-names.service';
import { PlacementGeneratorService } from '@app/services/placement-generator/placement-generator.service';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';
import { expect } from 'chai';
import Sinon = require('sinon');

const MOCK_SCORE_CONSTRAINTS = { minScore: 0, maxScore: 0 };
const MOCK_PLACEMENT = {
    position: { x: 0, y: 0 },
    letters: '',
    axis: AXIS.HORIZONTAL,
};

describe('VirtualPlayerService', () => {
    let placementGeneratorServiceStub: Sinon.SinonStubbedInstance<PlacementGeneratorService>;
    let virtualPlayerNamesServiceStub: Sinon.SinonStubbedInstance<VirtualPlayerNamesService>;
    let gameStub: Sinon.SinonStubbedInstance<Game>;
    let playerStub: Sinon.SinonStubbedInstance<Player>;
    let easelStub: Sinon.SinonStubbedInstance<Easel>;
    let gridStub: Sinon.SinonStubbedInstance<GridServer>;
    let virtualPlayerService: VirtualPlayerService;

    beforeEach(() => {
        placementGeneratorServiceStub = Sinon.createStubInstance(PlacementGeneratorService);
        placementGeneratorServiceStub.generatePlacements.returns([] as Placement[]);

        virtualPlayerNamesServiceStub = Sinon.createStubInstance(VirtualPlayerNamesService);

        easelStub = Sinon.createStubInstance(Easel);
        easelStub.getContent.returns([]);

        playerStub = Sinon.createStubInstance(Player);
        playerStub.getName.returns('name');

        gameStub = Sinon.createStubInstance(Game);
        gameStub.id = 'id';
        gameStub.otherPlayer = playerStub;
        gameStub.grid = gridStub;

        virtualPlayerService = new VirtualPlayerService(placementGeneratorServiceStub, virtualPlayerNamesServiceStub);
    });

    it('Should generate placements', (done: Mocha.Done) => {
        const clock = Sinon.useFakeTimers({ toFake: ['setTimeout', 'setInterval'] });
        placementGeneratorServiceStub.generatePlacements.returns([MOCK_PLACEMENT]);
        virtualPlayerService
            .generatePlacements('id', { easel: [], grid: [], constraints: MOCK_SCORE_CONSTRAINTS, isGridEmpty: false })
            .then((placements) => {
                expect(placements).to.deep.equal([MOCK_PLACEMENT]);
                expect(placementGeneratorServiceStub.generatePlacements.calledOnce);
                clock.restore();
                done();
            });
        clock.tick(MIN_THRESHOLD_MS);
    });

    it('Should get placements', (done: Mocha.Done) => {
        const clock = Sinon.useFakeTimers({ toFake: ['setTimeout', 'setInterval'] });
        const stub = Sinon.stub(virtualPlayerService, 'generatePlacements').returns(new Promise((resolve) => resolve([MOCK_PLACEMENT])));
        virtualPlayerService
            .getPlacements('id', { easel: [], grid: [], constraints: MOCK_SCORE_CONSTRAINTS, isGridEmpty: false })
            .then((placements) => {
                expect(placements).to.deep.equal([MOCK_PLACEMENT]);
                expect(stub.calledOnce);
                clock.tick(MAX_THRESHOLD_MS);
                clock.restore();
                done();
            });
        clock.tick(MIN_THRESHOLD_MS);
    });

    it('Should get placements', (done: Mocha.Done) => {
        const clock = Sinon.useFakeTimers({ toFake: ['setTimeout', 'setInterval'] });
        const stub = Sinon.stub(virtualPlayerService, 'generatePlacements').callsFake(async (gameId: string, request: PlacementRequest) => {
            clock.tick(MAX_THRESHOLD_MS);
            return new Promise((resolve) => resolve([MOCK_PLACEMENT]));
        });
        virtualPlayerService
            .getPlacements('id', { easel: [], grid: [], constraints: MOCK_SCORE_CONSTRAINTS, isGridEmpty: false })
            .then((placements) => {
                expect(placements).to.be.empty;
                expect(stub.calledOnce);
                clock.restore();
                done();
            });
        clock.tick(MIN_THRESHOLD_MS);
    });

    it('Should create message', () => {
        expect(virtualPlayerService.createMessage(gameStub, 'test')).to.deep.equal({
            gameId: 'id',
            playerId: 'virtual-player-id',
            playerName: 'name',
            content: 'test',
        });
    });

    it('Should returns virtual player available names', async () => {
        virtualPlayerNamesServiceStub.getVirtualPlayer.resolves([
            { name: 'name1', level: VirtualPlayerLevel.BEGINNER },
            { name: 'name2', level: VirtualPlayerLevel.BEGINNER },
            { name: 'name3', level: VirtualPlayerLevel.EXPERT },
        ]);
        expect(await virtualPlayerService.getVirtualPlayerNames()).to.deep.equal({
            beginner: ['name1', 'name2'],
            expert: ['name3'],
        });
        expect(virtualPlayerNamesServiceStub.getVirtualPlayer.calledOnce);
    });

    it('Should tell if the names list is valid', () => {
        expect(virtualPlayerService.isValidNames(['a', 'b', 'c'])).to.be.true;
        expect(virtualPlayerService.isValidNames(['a', 'b', 'c', 'd'])).to.be.true;
        expect(virtualPlayerService.isValidNames(['a', 'b'])).to.be.false;
    });

    it('Should tell if the index is valid', () => {
        expect(virtualPlayerService.isValidNamesIndex(['a', 'b', 'c'], 0)).to.be.false;
        expect(virtualPlayerService.isValidNamesIndex(['a', 'b', 'c'], 3)).to.be.false;
        expect(virtualPlayerService.isValidNamesIndex(['a', 'b', 'c', 'd'], 3)).to.be.true;
        expect(virtualPlayerService.isValidNamesIndex(['a', 'b', 'c', 'd', 'e'], 3)).to.be.true;
    });

    it('Should add name to the list', async () => {
        Sinon.stub(virtualPlayerService, 'getVirtualPlayerNames').resolves({ beginner: ['a', 'b', 'c'], expert: [] });
        expect(await virtualPlayerService.addName('name', VirtualPlayerLevel.BEGINNER)).to.be.true;
        expect(virtualPlayerNamesServiceStub.addVirtualPlayer.calledOnce);
    });

    it('Should add name to the list', async () => {
        Sinon.stub(virtualPlayerService, 'getVirtualPlayerNames').resolves({ beginner: [], expert: ['a', 'b', 'c', 'name'] });
        expect(await virtualPlayerService.addName('name', VirtualPlayerLevel.EXPERT)).to.be.false;
        expect(!virtualPlayerNamesServiceStub.addVirtualPlayer.calledOnce);
    });

    it('Should add name to the list', async () => {
        Sinon.stub(virtualPlayerService, 'getVirtualPlayerNames').resolves({ beginner: ['taken'], expert: ['a', 'b', 'c', 'name'] });
        expect(await virtualPlayerService.addName('taken', VirtualPlayerLevel.EXPERT)).to.be.false;
        expect(!virtualPlayerNamesServiceStub.addVirtualPlayer.calledOnce);
    });

    it('Should edit name in the list', async () => {
        Sinon.stub(virtualPlayerService, 'getVirtualPlayerNames').resolves({ beginner: ['a', 'b', 'c', 'd'], expert: [] });
        expect(await virtualPlayerService.editName(3, 'name', VirtualPlayerLevel.BEGINNER)).to.be.true;
        expect(virtualPlayerNamesServiceStub.updateVirtualPlayerByName.calledOnce);
    });

    it('Should edit name in the list', async () => {
        Sinon.stub(virtualPlayerService, 'getVirtualPlayerNames').resolves({ beginner: ['taken'], expert: ['a', 'b', 'c', 'name'] });
        expect(await virtualPlayerService.addName('taken', VirtualPlayerLevel.EXPERT)).to.be.false;
        expect(!virtualPlayerNamesServiceStub.updateVirtualPlayerByName.calledOnce);
    });

    it('Should edit name in the list', async () => {
        Sinon.stub(virtualPlayerService, 'getVirtualPlayerNames').resolves({ beginner: [], expert: ['a', 'b', 'c', 'name'] });
        expect(await virtualPlayerService.editName(0, 'name', VirtualPlayerLevel.EXPERT)).to.be.false;
        expect(!virtualPlayerNamesServiceStub.updateVirtualPlayerByName.calledOnce);
    });

    it('Should delete name from the list', async () => {
        Sinon.stub(virtualPlayerService, 'getVirtualPlayerNames').resolves({ beginner: ['a', 'b', 'c', 'd'], expert: [] });
        expect(await virtualPlayerService.deleteName(3, VirtualPlayerLevel.BEGINNER)).to.be.true;
        expect(virtualPlayerNamesServiceStub.deleteVirtualPlayer.calledOnce);
    });

    it('Should delete name from the list', async () => {
        Sinon.stub(virtualPlayerService, 'getVirtualPlayerNames').resolves({ beginner: [], expert: ['a', 'b', 'c', 'name'] });
        expect(await virtualPlayerService.deleteName(0, VirtualPlayerLevel.EXPERT)).to.be.false;
        expect(!virtualPlayerNamesServiceStub.deleteVirtualPlayer.calledOnce);
    });

    it('Should reset names from the list', async () => {
        expect(await virtualPlayerService.resetNames()).to.be.true;
        expect(!virtualPlayerNamesServiceStub.resetVirtualPlayers.calledOnce);
    });

    it('Should generate a random name for virtual player', async () => {
        virtualPlayerNamesServiceStub.getVirtualPlayer.resolves([
            { name: 'A', level: VirtualPlayerLevel.BEGINNER },
            { name: 'B', level: VirtualPlayerLevel.BEGINNER },
            { name: 'C', level: VirtualPlayerLevel.EXPERT },
        ]);
        expect(await virtualPlayerService.getRandomName('A', VirtualPlayerLevel.BEGINNER)).to.equal('B');
    });

    it('Should generate a random name for virtual player', async () => {
        virtualPlayerNamesServiceStub.getVirtualPlayer.resolves([
            { name: 'A', level: VirtualPlayerLevel.BEGINNER },
            { name: 'B', level: VirtualPlayerLevel.BEGINNER },
            { name: 'C', level: VirtualPlayerLevel.EXPERT },
        ]);
        expect(['A', 'C']).to.includes(await virtualPlayerService.getRandomName('B', VirtualPlayerLevel.BEGINNER));
    });

    it('Should generate a random name for virtual player', async () => {
        virtualPlayerNamesServiceStub.getVirtualPlayer.resolves([
            { name: 'A', level: VirtualPlayerLevel.BEGINNER },
            { name: 'B', level: VirtualPlayerLevel.BEGINNER },
            { name: 'C', level: VirtualPlayerLevel.EXPERT },
        ]);
        expect(await virtualPlayerService.getRandomName('A', VirtualPlayerLevel.EXPERT)).to.equal('C');
    });
});
