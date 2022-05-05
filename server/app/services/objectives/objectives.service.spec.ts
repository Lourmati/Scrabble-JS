/* eslint-disable @typescript-eslint/no-require-imports */
import { GridServer } from '@app/classes/grid/grid';
import { DEFAULT_DICTIONARY, DICTIONARIES_PATH } from '@app/constants/dictionary';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { PlacementService } from '@app/services/placement-utils/placement.service';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { cwd } from 'process';
import { ObjectivesService } from './objectives.service';
import Sinon = require('sinon');

describe('Objectives service', () => {
    let placer: PlacementService;
    let objectivesService: ObjectivesService;
    let dictionaryServiceStub: Sinon.SinonStubbedInstance<DictionaryService>;

    beforeEach(async () => {
        dictionaryServiceStub = Sinon.createStubInstance(DictionaryService);
        dictionaryServiceStub.getDictionaryByGameId.returns(JSON.parse(readFileSync(cwd() + DICTIONARIES_PATH + '/' + DEFAULT_DICTIONARY, 'utf8')));
        placer = new PlacementService(dictionaryServiceStub);
        objectivesService = new ObjectivesService(placer);
    });

    afterEach(() => {
        Sinon.restore();
    });

    // Objectif #1 : Placer un mot contenant 4 voyelles
    it('should find a word with 4 vowels', () => {
        const wordFound = objectivesService.wordContainsFourVowels(['table', 'caribou', 'proposition']);
        expect(wordFound).equal(true);
    });

    it('should not find a word with 4 vowels', () => {
        const wordFound = objectivesService.wordContainsFourVowels(['table', 'bon', '']);
        expect(wordFound).equal(false);
    });

    // Objectif #2 : Atteindre 100 points sans utiliser !échanger ou !indice
    it('should reach 100 points, without hints or exchange', () => {
        const reachedPoints = 101;
        const reachedCondition = objectivesService.hundredPointsWithoutExchangeOrHint(reachedPoints, false);
        expect(reachedCondition).equal(true);
    });

    it('should not reach 100 points, without hints or exchange', () => {
        const reachedPoints = 99;
        const reachedCondition = objectivesService.hundredPointsWithoutExchangeOrHint(reachedPoints, false);
        expect(reachedCondition).equal(false);
    });

    it('should not reach 100 points, with hints or exchange', () => {
        const reachedPoints = 100;
        const reachedCondition = objectivesService.hundredPointsWithoutExchangeOrHint(reachedPoints, true);
        expect(reachedCondition).equal(false);
    });

    it('should not reach 100 points, with hints or exchange', () => {
        const reachedPoints = 99;
        const reachedCondition = objectivesService.hundredPointsWithoutExchangeOrHint(reachedPoints, true);
        expect(reachedCondition).equal(false);
    });

    // Objectif #3 : Faire un placement en moins de 5 secondes
    it('should make a placement in less than 5 seconds', () => {
        const time = 4;
        const minimumTime = objectivesService.placementLessFiveSeconds(time);
        expect(minimumTime).equal(true);
    });

    it('should not make a placement in less than 5 seconds', () => {
        const time = 11;
        const minimumTime = objectivesService.placementLessFiveSeconds(time);
        expect(minimumTime).equal(false);
    });

    // Objectif #4 : Former un palindrome
    it('should find a palindrome', () => {
        const wordFound = objectivesService.wordIsPalindrome(['bonjour', 'kayak', 'revoir']);
        expect(wordFound).equal(true);
    });

    it('should not find a palindrome', () => {
        const wordFound = objectivesService.wordIsPalindrome(['bonjour', 'football', 'revoir']);
        expect(wordFound).equal(false);
    });

    // Objectif #5 : Former un mot sans aucune consonne
    it('should find a word with no consonant', () => {
        const wordFound = objectivesService.wordContainsNoConsonants(['bonjour', 'kayak', 'pour', 'oui', 'non']);
        expect(wordFound).equal(true);
    });

    it('should not find a with no consonants', () => {
        const wordFound = objectivesService.wordContainsNoConsonants(['bonjour', 'football', 'revoir']);
        expect(wordFound).equal(false);
    });

    // Objectif #6 : Former un mot qui commence et se termine avec une voyelle
    it('should find a word that begins and ends with vowel', () => {
        const wordFound = objectivesService.wordBeginsAndEndsWithVowel(['pomme', 'banane', 'orange']);
        expect(wordFound).equal(true);
    });

    it('should not find a word that begins and ends with vowel', () => {
        const wordFound = objectivesService.wordBeginsAndEndsWithVowel(['pomme', 'banane', 'barbe']);
        expect(wordFound).equal(false);
    });

    // Objectif #7 : Placer une lettre à la position O15
    it('should find a letter at the position O15', () => {
        const grid: GridServer = new GridServer();
        grid.boxes[15][15].value = 'B';
        const wordFound = objectivesService.positionO15Filled(grid.boxes);
        expect(wordFound).equal(true);
    });

    it('should not find a letter at the position O15', () => {
        const grid: GridServer = new GridServer();
        grid.boxes[15][15].value = '';
        const wordFound = objectivesService.positionO15Filled(grid.boxes);
        expect(wordFound).equal(false);
    });

    // Objectif #8 : Former un mot qui est anagramme avec un mot déjà présent sur la grille de jeu
    it('should find an anagram', () => {
        const wordFound = objectivesService.wordIsAnagram(['bonjour', 'carnet', 'revoir'], ['trop', 'nectar', 'vert']);
        expect(wordFound).equal(true);
    });

    it('should not find an anagram', () => {
        const wordFound = objectivesService.wordIsAnagram(['bonjour', 'carnet', 'revoir'], ['trop', 'bas', 'vert']);
        expect(wordFound).equal(false);
    });
});
