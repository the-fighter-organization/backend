import IReadOnlyService from "./types/IReadOnlyService";
import IEditService from "./types/IEditService";
import * as express from "express";
import { UserCRUDModel as UserCRUDModel, UserLoginModel } from '../model/usuarios/Usuario';
const CryptoJS = require("crypto-js");
import {passwordHash} from '../config/authentication.config.json'

export default class UsuarioService implements IReadOnlyService, IEditService {
  async save(req: express.Request, res: express.Response) {
    let model = new UserCRUDModel(req.body);
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    model.senha = CryptoJS.HmacSHA1(model.senha, passwordHash).toString()
    console.log(model._id)
    try {
      if (!model._id) {
        console.log("Inserindo")
        model = await model.save();
      } else {
        console.log("Alterando")
        model = await UserCRUDModel.findOneAndUpdate({_id:model._id}, model)
      }
      return res.status(200).json(model);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async authenticate(req: express.Request, res: express.Response) {
    let model = new UserLoginModel(req.body);
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    try {
      let senha = CryptoJS.HmacSHA1(model.senha, passwordHash)
      let response = await model.authenticate(model.email, senha.toString())

      if (!response) {
        return res.status(401).json({ message: "Usuário ou senha incorretos!" })
      }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async remove(req: express.Request, res: express.Response) {
    if (!req.params.id) {
      return res.status(400);
    }
    try {
      let q = await UserCRUDModel.findOneAndRemove({_id : req.params.id});
      return res.status(200).json(q);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async findAll(req: express.Request, res: express.Response) {
    try {
      let results = await UserCRUDModel.find()
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async findOne(req: express.Request, res: express.Response) {
    try {
      let result = await UserCRUDModel.findOne({_id : req.params.id})

      if (result) {
        return res.status(200).json(result)
      } else {
        return res.status(404);
      }
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}
