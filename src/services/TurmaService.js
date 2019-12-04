import { TurmaCRUDModel } from '../model/turmas/Turma';
import { getUserIdFromRequest } from '../util/userModelShortcuts';

export default class TurmaService {
  async save(req, res) {
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
        return res.status(400).json({ message: "A alteração de turma resultou em erro" })
      }
      return res.status(200).json(model);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }


  async remove(req, res) {
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

  async findAll(req, res) {
    try {
      let results = await TurmaCRUDModel.find({ usuario: getUserIdFromRequest(req) })
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async find(req, res) {
    const { filters, select } = req.body;
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

  async findOne(req, res) {
    try {
      let result = await TurmaCRUDModel
        .findOne({ _id: req.params.id, usuario: getUserIdFromRequest(req) });

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
