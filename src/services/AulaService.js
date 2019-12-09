import { TurmaCRUDModel } from '../model/turmas/Turma';
import { getUserIdFromRequest } from '../util/userModelShortcuts';

export default class AulaService {
  async save(req, res) {
    try {
      // preenchendo model
      let model = await TurmaCRUDModel.findOne({ _id: req.params.turmaId, usuario: getUserIdFromRequest(req) })
      let indexAula = null;

      if (!model) {
        return res.status(404).json({ message: "A turma da aula não existe!" })
      }

      if (req.body._id) {
        const index = model.aulas.findIndex(q => q._id == req.body._id)

        if (index === -1) {
          return res.status(404).json({ message: "A aula a alterar não foi encontrada no banco de dados!" })
        }

        model.aulas.splice(index, 1, req.body)
        indexAula = index;
      }
      else {
        req.body.dataRegistro = new Date();
        indexAula = model.aulas.length + 1;
        model.aulas.push(req.body)
      }

      const validation = model.validateSync();

      if (validation) {
        return res.status(400).json(validation);
      }

      model = await model.save();

      if (!model) {
        return res.status(400).json({ message: "A alteração do aluno resultou em erro" })
      }

      return res.status(200).json(model.aulas[indexAula] || {});
    } catch (error) {
      return res.status(500).json(error);
    }
  }


  async remove(req, res) {
    if (!req.params.id) {
      return res.status(400).json({ message: "Não foi possível excluir, o id não foi informado!" });
    }
    if (!req.params.turmaId) {
      return res.status(400).json({ message: "Não foi possível excluir, o id da turma não foi informado!" });
    }

    let model = await TurmaCRUDModel.findOne({ _id: req.params.turmaId, usuario: getUserIdFromRequest(req) })

    if (!model) {
      return res.status(404).json({ message: "A turma da aula a ser excluída não existe!" });
    }

    try {
      const index = model.aulas.findIndex(q => q._id == req.params.id);

      if (index === -1) {
        return res.status(404).json({ message: "A aula a excluir não foi encontrada!" });
      }

      const excluido = model.aulas.splice(index, 1);

      if (!excluido) {
        return res.status(404).json({ message: "A aula a excluir não foi encontrada!" });
      }

      model = await model.save();
      return res.status(200).json(model);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async findAll(req, res) {
    try {
      const results = await TurmaCRUDModel.find({ usuario: getUserIdFromRequest(req) });
      const aulas = results
        .map(turma => (
          (turma.toObject()).aulas.map(aula => ({ ...aula, turma: { nome: turma.nome, _id: turma._id } })))
        )
        .reduce((previus, current) => [...previus, ...current], []);
      return res.status(200).json(aulas);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async find(req, res) {
    const { filters } = req.body;
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

      const results = await query.exec();
      const aulas = results.map(turma => (
        (turma.toObject()).aulas.map(aula => ({ ...aula, turma: { nome: turma.nome, _id: turma._id } })))
      ).reduce((previus, current) => [...previus, ...current], []);

      return res.status(200).json(aulas);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async findOne(req, res) {
    try {
      const turma = await TurmaCRUDModel.findOne({ _id: req.params.turmaId, usuario: getUserIdFromRequest(req) })

      if (!turma) {
        return res.status(404).json({ message: "A turma da aula solicitada não existe!" })
      }

      let aula = (turma.aulas.find(q => q._id == req.params.id)).toObject();
      aula.turma = turma.toObject();
      aula.turmaId = turma._id;

      if (!aula) {
        return res.status(404).json({ message: "A aula solicitada não existe!" })
      }

      if (aula) {
        return res.status(200).json(aula)
      } else {
        return res.status(404);
      }
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}
