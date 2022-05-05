/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DEFAULT_DICTIONARY, DICTIONARIES_PATH } from '@app/constants/dictionary';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { FileService } from '@app/services/file/file.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import { expect } from 'chai';
import { cwd } from 'process';
import Sinon = require('sinon');

describe('DictionaryService', () => {
    let service: DictionaryService;
    let socketCommunicationServiceStub: Sinon.SinonStubbedInstance<SocketCommunicationService>;
    let fileServiceStub: Sinon.SinonStubbedInstance<FileService>;

    beforeEach(() => {
        fileServiceStub = Sinon.createStubInstance(FileService);
        socketCommunicationServiceStub = Sinon.createStubInstance(SocketCommunicationService);
        service = new DictionaryService(fileServiceStub, socketCommunicationServiceStub);
    });

    it('Should get dictionaries', () => {
        fileServiceStub.getFilesInDirectory.returns(['a.json']);
        fileServiceStub.readJSONFile.returns({ title: 'title', description: 'description' });
        expect(service.getDictionaries(false)).to.deep.equal([{ title: 'title', description: 'description', filename: 'a.json' }]);
    });

    it('Should get dictionaries', () => {
        fileServiceStub.getFilesInDirectory.returns(['a.json']);
        fileServiceStub.readJSONFile.returns({ title: 'title', description: 'description' });
        service.toDelete = ['a.json'];
        expect(service.getDictionaries(false)).to.deep.equal([]);
    });

    it('Should get dictionaries', () => {
        fileServiceStub.getFilesInDirectory.returns(['a.json']);
        fileServiceStub.readJSONFile.returns({ title: 'title', description: 'description' });
        service.toDelete = ['a.json'];
        expect(service.getDictionaries(true)).to.deep.equal([{ title: 'title', description: 'description', filename: 'a.json' }]);
    });

    it('Should get dictionary', () => {
        fileServiceStub.doesFileExist.returns(true);
        fileServiceStub.readJSONFile.withArgs(service.defaultDictionary).returns({ title: 'default', description: 'description', words: [] });
        fileServiceStub.readJSONFile
            .withArgs(service.dictionaryPath + '/dictionary.json')
            .returns({ title: 'title', description: 'description', words: [] });
        expect(service.getDictionary('dictionary.json')).to.deep.equal({ title: 'title', description: 'description', words: [] });
    });

    it('Should get dictionary', () => {
        fileServiceStub.doesFileExist.returns(false);
        fileServiceStub.readJSONFile.withArgs(service.defaultDictionary).returns({ title: 'default', description: 'description', words: [] });
        fileServiceStub.readJSONFile
            .withArgs(service.dictionaryPath + '/dictionary.json')
            .returns({ title: 'title', description: 'description', words: [] });
        expect(service.getDictionary('dictionary.json')).to.deep.equal({ title: 'default', description: 'description', words: [] });
    });

    it('Should get dictionary by id', () => {
        service.gameIdToDictionary.set('id', { title: 'title', description: 'description', words: [] });
        Sinon.stub(service, 'getDictionary').returns({ title: 'title', description: 'description', words: [] });
        expect(service.getDictionaryByGameId('id').title).to.equal('title');
    });

    it('Should get dictionary by id', () => {
        service.gameIdToFilename.set('id', 'dico.json');
        Sinon.stub(service, 'getDictionary').returns({ title: 'title', description: 'description', words: [] });
        expect(service.getDictionaryByGameId('id').title).to.equal('title');
    });

    it('Should get dictionary by id', () => {
        Sinon.stub(service, 'getDictionary').returns({ title: 'default', description: 'description', words: [] });
        expect(service.getDictionaryByGameId('id').title).to.equal('default');
    });

    it('Should get the title of a dictionary', () => {
        fileServiceStub.doesFileExist.returns(true);
        fileServiceStub.readJSONFile.returns({ title: 'title', description: 'description', words: [] });
        expect(service.getTitle('dictionary.json')).to.equal('title');
    });

    it('Should get the title of a dictionary', () => {
        fileServiceStub.doesFileExist.returns(false);
        fileServiceStub.readJSONFile.returns({ title: 'title', description: 'description', words: [] });
        expect(service.getTitle('dictionary.json')).to.equal('Dictionnaire inconnu');
    });

    it('Should use a dictionary (1)', () => {
        service.useDictionary('id', 'dictionary.json');
        expect(service.usage.get('dictionary.json')).to.equal(1);
    });

    it('Should use a dictionary (2)', () => {
        service.usage.set('dictionary.json', 2);
        service.useDictionary('id', 'dictionary.json');
        expect(service.usage.get('dictionary.json')).to.equal(3);
    });

    it('Should release a dictionary (1)', () => {
        const spy = Sinon.spy(service.usage, 'set');
        service.releaseDictionary('id', 'dictionary.json');
        expect(!spy.calledOnce);
    });

    it('Should release a dictionary (2)', () => {
        service.usage.set('dictionary.json', 1);
        service.releaseDictionary('id', 'dictionary.json');
        expect(service.usage.get('dictionary.json')).to.equal(0);
    });

    it('Should release a dictionary (3)', () => {
        service.usage.set('dictionary.json', 3);
        service.releaseDictionary('id', 'dictionary.json');
        expect(service.usage.get('dictionary.json')).to.equal(2);
    });

    it('Should release a dictionary (4)', () => {
        service.usage.set('dictionary.json', 1);
        service.toDelete = ['dictionary.json'];
        const stub = Sinon.stub(service, 'deleteDictionary');
        service.releaseDictionary('id', 'dictionary.json');
        expect(service.usage.get('dictionary.json')).to.equal(0);
        expect(stub.calledOnce);
        expect(service.toDelete).to.deep.equal([]);
    });

    it('Should return true of the title already exists', () => {
        fileServiceStub.getFilesInDirectory.returns(['a.json', 'b.json']);
        fileServiceStub.readJSONFile.withArgs(cwd() + DICTIONARIES_PATH + '/a.json').returns({ title: 'titlea', description: 'description' });
        fileServiceStub.readJSONFile.withArgs(cwd() + DICTIONARIES_PATH + '/b.json').returns({ title: 'titleb', description: 'description' });
        expect(service.doesTitleAlreadyExist('titlea', 'a.json')).to.be.false;
    });

    it('Should return true of the title already exists', () => {
        fileServiceStub.getFilesInDirectory.returns(['a.json', 'b.json']);
        fileServiceStub.readJSONFile.withArgs(cwd() + DICTIONARIES_PATH + '/a.json').returns({ title: 'titlea', description: 'description' });
        fileServiceStub.readJSONFile.withArgs(cwd() + DICTIONARIES_PATH + '/b.json').returns({ title: 'titleb', description: 'description' });
        expect(service.doesTitleAlreadyExist('titlea', 'b.json')).to.be.true;
    });

    it('Should add a dictionary', () => {
        fileServiceStub.doesFileExist.returns(false);
        expect(service.addDictionary('path')).to.be.false;
    });

    it('Should add a dictionary', () => {
        fileServiceStub.doesFileExist.returns(true);
        fileServiceStub.readJSONFile.returns({ title: 'title', description: 'description' });
        Sinon.stub(service, 'doesTitleAlreadyExist').returns(true);
        expect(service.addDictionary('path')).to.be.false;
    });

    it('Should add a dictionary', () => {
        fileServiceStub.doesFileExist.returns(true);
        fileServiceStub.readJSONFile.returns({ title: 'title', description: 'description' });
        Sinon.stub(service, 'doesTitleAlreadyExist').returns(false);
        const stub = Sinon.stub(service, 'updateAvailableDictionaries');
        expect(service.addDictionary('path')).to.be.true;
        expect(stub.calledOnce);
    });

    it('Should update a dictionary', () => {
        Sinon.stub(service, 'doesTitleAlreadyExist').returns(true);
        expect(service.updateDictionary({ title: 'title', description: 'description', filename: 'filename' })).to.be.false;
    });

    it('Should update a dictionary', () => {
        Sinon.stub(service, 'doesTitleAlreadyExist').returns(false);
        fileServiceStub.doesFileExist.returns(false);
        expect(service.updateDictionary({ title: 'title', description: 'description', filename: 'filename' })).to.be.false;
    });

    it('Should update a dictionary', () => {
        Sinon.stub(service, 'doesTitleAlreadyExist').returns(false);
        fileServiceStub.doesFileExist.returns(true);
        fileServiceStub.readJSONFile.returns({ title: 'title', description: 'description' });
        const stub = Sinon.stub(service, 'updateAvailableDictionaries');
        expect(service.updateDictionary({ title: 'title', description: 'description', filename: 'filename' })).to.be.true;
        expect(fileServiceStub.writeJSONFile.calledOnce);
        expect(stub.calledOnce);
    });

    it('Should delete a dictionary', () => {
        fileServiceStub.deleteFile.returns(true);
        service.usage.set('path.json', 1);
        const stub = Sinon.stub(service, 'updateAvailableDictionaries');
        expect(service.deleteDictionary('path.json')).to.be.true;
        expect(service.toDelete).to.deep.equal(['path.json']);
        expect(stub.calledOnce);
    });

    it('Should delete a dictionary', () => {
        fileServiceStub.deleteFile.returns(true);
        service.usage.set('path.json', 0);
        const stub = Sinon.stub(service, 'updateAvailableDictionaries');
        expect(service.deleteDictionary('path.json')).to.be.true;
        expect(fileServiceStub.deleteFile.calledOnce);
        expect(stub.calledOnce);
    });

    it('Should delete a dictionary', () => {
        fileServiceStub.deleteFile.returns(false);
        service.usage.set('path.json', 0);
        const stub = Sinon.stub(service, 'updateAvailableDictionaries');
        expect(service.deleteDictionary('path.json')).to.be.false;
        expect(fileServiceStub.deleteFile.calledOnce);
        expect(stub.calledOnce);
    });

    it('Should delete a dictionary', () => {
        expect(service.deleteDictionary(DEFAULT_DICTIONARY)).to.be.false;
    });

    it('Should update available dictionaries', () => {
        Sinon.stub(service, 'getDictionaries').returns([]);
        service.updateAvailableDictionaries();
        expect(socketCommunicationServiceStub.emitToBroadcast.calledOnce);
    });

    it('Should reset dictionaries', () => {
        fileServiceStub.getFilesInDirectory.returns(['a.json', 'b.json', DEFAULT_DICTIONARY]);
        const stub = Sinon.stub(service, 'deleteDictionary');
        service.resetDictionaries();
        expect(stub.calledOnceWith('a.json'));
        expect(stub.calledOnceWith('b.json'));
    });
});
