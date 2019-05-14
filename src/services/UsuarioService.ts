import IReadOnlyService from "./types/IReadOnlyService";
import IEditService from "./types/IEditService";
import * as express from "express";
import { UserCRUDModel as UserCRUDModel, UserLoginModel, IUserModel } from '../model/usuarios/Usuario';

export default class UsuarioService implements IReadOnlyService, IEditService {
  async save(req: express.Request, res: express.Response) {
    let model = new UserCRUDModel(req.body);
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    try {
      let obj: IUserModel = null;
      if (model._id) {
        obj = await model.save();
      } else {
        obj = await UserCRUDModel.findById(model._id);
        obj.email = model.email
        obj.nome = model.nome
        obj.senha = model.senha
        obj.save()
      }
      return res.status(200).json(obj);
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
      let response = await model.authenticate(model.email, model.senha)

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
      let q = await UserCRUDModel.findByIdAndRemove(req.params.id);
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
      let result = await UserCRUDModel.findById(req.params.id)

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
