import IReadOnlyService from "./types/IReadOnlyService";
import IEditService from "./types/IEditService";
import * as express from "express";
import { UserModel } from '../model/usuarios/Usuario';

export default class UsuarioService implements IReadOnlyService, IEditService {
  async save(req: express.Request, res: express.Response) {
    let model = new UserModel(req.body);
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    try {
      let obj = await model.save();
      return res.status(200).json(obj);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async authenticate(req:express.Request, res:express.Response){
    let model = new UserModel(req.body);
    let validation = model.validateSync();

    if(validation){
      return res.status(400).json({validation});
    }

    try {
      return res.status(200).json(await model.authenticate());
    } catch (error) {
      return res.status(500).json(error)
    }
  }
  async remove(req: express.Request, res: express.Response) {
    if (!req.params.id) {
      return res.status(400);
    }
    try {
      let q = await UserModel.findByIdAndRemove(req.params.id);
      return res.status(200).json(q);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
  async findAll(req: express.Request, res: express.Response) {
    try {
      let results = await UserModel.find()
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error)
    }
  }
  async findOne(req: express.Request, res: express.Response) {
    try {
      let result = await UserModel.findById(req.params.id)
      
      if(result){
        return res.status(200).json(result)
      }else{
        return res.status(404);
      }
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}
