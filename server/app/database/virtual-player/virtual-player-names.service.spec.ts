import { DUMMY_VP_NUMBER, MOCK_VIRTUAL_PLAYER_BEGINNER, MOCK_VIRTUAL_PLAYER_EXPERT, VirtualPlayer } from '@app/constants/virtual-player';
import { DatabaseServiceMock } from '@app/database//database/database.service.mock';
import { DatabaseService } from '@app/database/database/database.service';
import { VirtualPlayerNamesService } from '@app/database/virtual-player/virtual-player-names.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';

chai.use(chaiAsPromised);

describe('Virtual player names service', () => {
    let virtualPlayerNamesService: VirtualPlayerNamesService;
    let databaseService: DatabaseServiceMock;
    let client: MongoClient | undefined;
    const populateDb = async (...virtualPlayer: VirtualPlayer[]) => {
        await databaseService.populateDb('virtualPlayer', virtualPlayer);
    };
    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        client = (await databaseService.start()) as MongoClient;
        virtualPlayerNamesService = new VirtualPlayerNamesService(databaseService as unknown as DatabaseService);
        databaseService.start();
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all names', async () => {
        await populateDb(MOCK_VIRTUAL_PLAYER_BEGINNER, MOCK_VIRTUAL_PLAYER_EXPERT);
        const virtualPlayers = await virtualPlayerNamesService.getVirtualPlayer();
        expect(virtualPlayers.length).to.equal(2);
        expect(virtualPlayers).to.deep.equals([MOCK_VIRTUAL_PLAYER_BEGINNER, MOCK_VIRTUAL_PLAYER_EXPERT]);
    });

    it('should get all beginner virtual players from the collection', async () => {
        await populateDb(MOCK_VIRTUAL_PLAYER_BEGINNER);
        const virtualPlayers = await virtualPlayerNamesService.getVirtualPlayerByLevel(0);
        expect(virtualPlayers.length).to.equal(1);
        expect(MOCK_VIRTUAL_PLAYER_BEGINNER).to.deep.equals(virtualPlayers[0]);
    });

    it('should get all expert virtual players from the collection', async () => {
        await populateDb(MOCK_VIRTUAL_PLAYER_EXPERT);
        const virtualPlayers = await virtualPlayerNamesService.getVirtualPlayerByLevel(1);
        expect(virtualPlayers.length).to.equal(1);
        expect(MOCK_VIRTUAL_PLAYER_EXPERT).to.deep.equals(virtualPlayers[0]);
    });

    it('should insert a new virtual player in the collection', async () => {
        await virtualPlayerNamesService.addVirtualPlayer(MOCK_VIRTUAL_PLAYER_BEGINNER);
        const virtualPlayers = await virtualPlayerNamesService.collection.find({}).toArray();
        expect(virtualPlayers.length).to.equal(1);
        expect(MOCK_VIRTUAL_PLAYER_BEGINNER).to.deep.equals(virtualPlayers[0]);
    });

    it('should delete a virtual player given by parameter in the collection', async () => {
        await populateDb(MOCK_VIRTUAL_PLAYER_BEGINNER);
        await virtualPlayerNamesService.deleteVirtualPlayer(MOCK_VIRTUAL_PLAYER_BEGINNER);
        const gameHistory = await virtualPlayerNamesService.collection.find({}).toArray();
        expect(gameHistory.length).to.equal(0);
    });

    it('should get virtual player by name', async () => {
        await populateDb(MOCK_VIRTUAL_PLAYER_BEGINNER);
        const virtualPlayer = await virtualPlayerNamesService.getVirtualPlayerByName('player1');
        expect(virtualPlayer[0].name).to.equal(MOCK_VIRTUAL_PLAYER_BEGINNER.name);
    });

    it('should update virtual player name by another name', async () => {
        await populateDb(MOCK_VIRTUAL_PLAYER_BEGINNER, MOCK_VIRTUAL_PLAYER_EXPERT);
        await virtualPlayerNamesService.updateVirtualPlayerByName('player1', 'player2');
        const virtualPlayers = await virtualPlayerNamesService.collection.find({}).toArray();
        expect(virtualPlayers[0].name).to.equal('player2');
    });

    it('should delete all existing virtual player in the collection', async () => {
        await populateDb(MOCK_VIRTUAL_PLAYER_BEGINNER);
        await virtualPlayerNamesService.deleteAllVirtualPlayers();
        const virtualPlayers = await virtualPlayerNamesService.collection.find({}).toArray();
        expect(virtualPlayers.length).to.equal(0);
    });

    it('should insert dummy virtual players in the collection', async () => {
        await virtualPlayerNamesService.addDummyVirtualPlayers();
        const virtualPlayers = await virtualPlayerNamesService.collection.find({}).toArray();
        expect(virtualPlayers.length).to.equal(DUMMY_VP_NUMBER);
    });

    it('should reset all score when reset scores is called', async () => {
        await populateDb(MOCK_VIRTUAL_PLAYER_BEGINNER, MOCK_VIRTUAL_PLAYER_EXPERT);
        await virtualPlayerNamesService.resetVirtualPlayers();
        const virtualPlayers = await virtualPlayerNamesService.collection.find({}).toArray();
        expect(virtualPlayers.length).to.equal(DUMMY_VP_NUMBER);
    });

    describe('Error handling', async () => {
        it('should throw an error if we try to get all game history on a closed connection', async () => {
            await client?.close();
        });
        it('close connection should return a promise when client is undefined', async () => {
            // eslint-disable-next-line dot-notation
            databaseService['client'] = undefined;
            databaseService.closeConnection();
            expect(true);
        });
        it('should throw an error if we try to add dummy virtual players on a closed connection', async () => {
            await client?.close();
            expect(virtualPlayerNamesService.addDummyVirtualPlayers()).to.eventually.be.rejectedWith(Error);
        });
    });
});
