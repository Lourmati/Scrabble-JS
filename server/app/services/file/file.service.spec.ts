/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Dictionary } from '@app/classes/common/dictionary';
import { FileService } from '@app/services/file/file.service';
import { expect } from 'chai';
import * as fs from 'fs';
import { cwd } from 'process';

const MOCK_DATA = { a: 1, b: 2, c: 3 };

describe('FileService', () => {
    let service: FileService;
    let path: string;

    beforeEach(() => {
        service = new FileService();
        path = cwd() + '/app/services/file/test.json';
        fs.writeFileSync(path, JSON.stringify(MOCK_DATA));
    });

    afterEach(() => {
        if (fs.existsSync(path)) fs.unlinkSync(path);
    });

    it('Should return if the file exist', () => {
        expect(service.doesFileExist(path)).to.be.true;
    });

    it('Should return if the file exist', () => {
        expect(service.doesFileExist('bad.json')).to.be.false;
    });

    it('Should read a file', () => {
        expect(service.readJSONFile(path)).to.deep.equal(MOCK_DATA);
    });

    it('Should write a file', () => {
        const data = { a: 1, b: 2, c: 3, d: 4 };
        service.writeJSONFile(path, data as unknown as Dictionary);
        expect(service.readJSONFile(path)).to.deep.equal(data);
    });

    it('Should delete a file', () => {
        expect(service.deleteFile(path)).to.be.true;
        expect(service.doesFileExist(path)).to.be.false;
    });

    it('Should delete a file', () => {
        expect(service.deleteFile('bad.json')).to.be.false;
    });

    it('Should get files in directory', () => {
        expect(service.getFilesInDirectory(path.replace('/test.json', ''))).to.deep.equal(['file.service.spec.ts', 'file.service.ts', 'test.json']);
    });
});
