import IReadOnlyService from "./types/IReadOnlyService";
import IEditService from "./types/IEditService";
import * as express from "express";
import { AlunoCRUDModel } from "../model/alunos/Aluno";
import { getUserIdFromRequest } from "../util/userModelShortcuts";

export default class AlunoService implements IReadOnlyService, IEditService {
  async save(req: express.Request, res: express.Response) {
    // preenchendo model
    let model = new AlunoCRUDModel(req.body);
    model.usuario = getUserIdFromRequest(req);

    // validando
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    try {
      if (!req.body._id) {
        model = await model.save();
      } else {
        model = await AlunoCRUDModel.findOneAndUpdate({ _id: req.body._id }, model, { new: true })
      }

      if (!model) {
        return res.status(400).json({ message: "A alteração de usuário resultou em erro" } as Error)
      }
      return res.status(200).json(model);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async remove(req: express.Request, res: express.Response) {
    if (!req.params.id) {
      return res.status(400);
    }
    try {
      let q = await AlunoCRUDModel.findOneAndRemove({ _id: req.params.id, usuario: getUserIdFromRequest(req) });
      return res.status(200).json(q);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async findAll(req: express.Request, res: express.Response) {
    try {
      let results = await AlunoCRUDModel.find({ usuario: getUserIdFromRequest(req) })
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async find(req: express.Request, res: express.Response) {
    try {
      let query = AlunoCRUDModel.find({ usuario: getUserIdFromRequest(req) })

      const obj = req.body;
      const keys = Object.keys(obj);

      keys.forEach(key => {
        if (typeof obj[key] === "string") {
          query.where(key, new RegExp(obj[key], 'i'));
        } else {
          query.where(key, obj[key])
        }
      });

      const results = await query.exec();

      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async findOne(req: express.Request, res: express.Response) {
    try {
      let result = await AlunoCRUDModel.findOne({ _id: req.params.id, usuario: getUserIdFromRequest(req) })

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
