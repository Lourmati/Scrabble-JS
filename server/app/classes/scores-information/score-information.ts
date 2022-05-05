import { ObjectId } from 'mongodb';

export interface Score {
    _id?: ObjectId;
    name: string[];
    score: number;
    playerMode: string;
}
