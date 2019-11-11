import * as express from "express";
import { ConfiguracaoCRUDModel } from "../model/configuracoes/Configuracao";
import { getUserIdFromRequest } from "../util/userModelShortcuts";

export default class ConfiguracaoService {
  async save(req: express.Request, res: express.Response) {
    // preenchendo model
    let model = new ConfiguracaoCRUDModel(req.body);
    model.usuario = getUserIdFromRequest(req);

    // validando
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json(validation);
    }

    const modelToEdit = await ConfiguracaoCRUDModel.findOne({ usuario: getUserIdFromRequest(req) })

    try {
      if (!modelToEdit) {
        model = await model.save();
      } else {
        model = await ConfiguracaoCRUDModel.findOneAndUpdate(
          { usuario: model.usuario },
          model,
          { new: true })
      }

      if (!model) {
        return res.status(400).json({ message: "A alteração de usuário resultou em erro" } as Error)
      }
      return res.status(200).json(model);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async findOne(req: express.Request, res: express.Response) {
    try {
      let result = await ConfiguracaoCRUDModel.findOne({ usuario: getUserIdFromRequest(req) })

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
