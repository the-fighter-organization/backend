import * as express from 'express';

export default interface IEditService {
    save: (req:express.Request, res:express.Response) => void,
    remove: (req:express.Request, res:express.Response) => void
}