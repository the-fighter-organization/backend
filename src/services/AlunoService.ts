import IReadOnlyService from "./types/IReadOnlyService";
import IEditService from "./types/IEditService";
import * as express from "express";
import { AlunoCRUDModel } from "../model/alunos/Aluno";

export default class AlunoService implements IReadOnlyService, IEditService {
  async save(req: express.Request, res: express.Response) {
    let model = new AlunoCRUDModel(req.body);
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    try {
      if (!model._id) {
        model = await model.save();
      } else {
        model = await AlunoCRUDModel.findOneAndUpdate({ _id: model._id }, model)
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
      let q = await AlunoCRUDModel.findOneAndRemove({ _id: req.params.id });
      return res.status(200).json(q);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async findAll(req: express.Request, res: express.Response) {
    try {
      let results = await AlunoCRUDModel.find()
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async findOne(req: express.Request, res: express.Response) {
    try {
      let result = await AlunoCRUDModel.findOne({ _id: req.params.id })

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
