import { Request } from 'express';
import * as mongoose from 'mongoose'

import { IUserModel } from '../model/usuarios/Usuario';

export interface IUserPassport{
    _id: mongoose.Schema.Types.ObjectId
    nome:string;
    email:string;
}

export function getUserFromRequest(req: Request): IUserPassport{
    let user = req.user._doc as IUserModel;

    return {
        _id : user._id,
        email: user.email,
        nome: user.nome
    } as IUserPassport
}

export function getUserIdFromRequest(req: Request): mongoose.Schema.Types.ObjectId{
    return req.user._doc._id
}