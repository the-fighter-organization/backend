import IReadOnlyService from "./types/IReadOnlyService";
import IEditService from "./types/IEditService";
import * as express from "express";
import { PaiAlunoCRUDModel } from "../model/paisAlunos/PaiAluno";

export default class PaiAlunoService implements IReadOnlyService, IEditService {
  async save(req: express.Request, res: express.Response) {
    let model = new PaiAlunoCRUDModel(req.body);
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    try {
      if (!model._id) {
        model = await model.save();
      } else {
        model = await PaiAlunoCRUDModel.findOneAndUpdate({_id:model._id}, model)
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
      let q = await PaiAlunoCRUDModel.findOneAndRemove({_id : req.params.id});
      return res.status(200).json(q);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async findAll(req: express.Request, res: express.Response) {
    try {
      let results = await PaiAlunoCRUDModel.find()
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async findOne(req: express.Request, res: express.Response) {
    try {
      let result = await PaiAlunoCRUDModel.findOneAndRemove({_id : req.params.id})

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
