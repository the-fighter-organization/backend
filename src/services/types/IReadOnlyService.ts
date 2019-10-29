import * as express from 'express';
export interface IBuscaParameters {
    filters: any;
    select: string;
}
export default interface IReadOnlyService {
    findAll: (req: express.Request, res: express.Response) => void,
    findOne: (req: express.Request, res: express.Response) => void
}