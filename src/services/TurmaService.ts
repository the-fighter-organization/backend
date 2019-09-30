import IReadOnlyService, { IBuscaParameters } from "./types/IReadOnlyService";
import IEditService from "./types/IEditService";
import * as express from "express";
import { getUserIdFromRequest } from "../util/userModelShortcuts";
import { TurmaCRUDModel } from '../model/turmas/Turma';

export default class TurmaService implements IReadOnlyService, IEditService {
  async save(req: express.Request, res: express.Response) {
    // preenchendo model
    let model = new TurmaCRUDModel(req.body);
    model.usuario = getUserIdFromRequest(req);

    // validando
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json(validation);
    }

    try {
      if (!req.body._id) {
        model = await model.save();
      } else {
        model = await TurmaCRUDModel.findOneAndUpdate(
          { _id: req.body._id, usuario: model.usuario },
          model,
          { new: true })
      }

      if (!model) {
        return res.status(400).json({ message: "A alteração de turma resultou em erro" } as Error)
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
      let q = await TurmaCRUDModel.findOneAndRemove({ _id: req.params.id, usuario: getUserIdFromRequest(req) });
      return res.status(200).json(q);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async findAll(req: express.Request, res: express.Response) {
    try {
      let results = await TurmaCRUDModel.find({ usuario: getUserIdFromRequest(req) })
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async find(req: express.Request, res: express.Response) {
    const { filters, select } = req.body as IBuscaParameters;
    try {
      let query = TurmaCRUDModel.find({ usuario: getUserIdFromRequest(req) })

      const keys = filters ? Object.keys(filters) : [];

      keys.forEach(key => {
        if (typeof filters[key] === "string") {
          query.where(key, new RegExp(filters[key], 'i'));
        } else {
          query.where(key, filters[key])
        }
      });

      if (select) {
        query.select(select);
      }

      const results = await query.exec();

      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async findOne(req: express.Request, res: express.Response) {
    try {
      let result = await TurmaCRUDModel.findOne({ _id: req.params.id, usuario: getUserIdFromRequest(req) })

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
