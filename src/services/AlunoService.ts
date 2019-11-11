import * as express from 'express';

import { AlunoCRUDModel } from '../model/alunos/Aluno';
import { Alunos } from '../model/alunos/types';
import { getUserIdFromRequest } from '../util/userModelShortcuts';
import IEditService from './types/IEditService';
import IReadOnlyService, { IBuscaParameters } from './types/IReadOnlyService';
import { ConfiguracaoCRUDModel } from '../model/configuracoes/Configuracao';
import { monthDiff } from '../util/date';

export default class AlunoService implements IReadOnlyService, IEditService {
  async save(req: express.Request, res: express.Response) {
    // preenchendo model
    const body: Alunos.Types.IAlunoModel = req.body;
    let model = new AlunoCRUDModel(body);

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
        const oldModel = await AlunoCRUDModel.findOne({ _id: req.body._id, usuario: model.usuario });

        if (oldModel.inativo == true && model.inativo == false) {
          model.ultimaAtivacao = new Date()
        }

        model = await AlunoCRUDModel.findOneAndUpdate(
          { _id: req.body._id, usuario: model.usuario },
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

  async remove(req: express.Request, res: express.Response) {
    if (!req.params.id) {
      return res.status(400);
    }
    try {
      let q = await AlunoCRUDModel.findOneAndRemove({ _id: req.params.id, usuario: getUserIdFromRequest(req) });
      return res.status(200).json(q);
    } catch (error) {
      return res.status(500).json(error);
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

  async findAllMensalidadesVencidas(req: express.Request, res: express.Response) {
    try {
      const configuracao = await ConfiguracaoCRUDModel.findOne({ usuario: getUserIdFromRequest(req) });

      if (!configuracao || !configuracao.diaVencimentoMensalidade) {
        return res.status(400).json({ message: "A configuração de dia de vencimento da mensalidade não foi preenchida" })
      }

      const alunos = await AlunoCRUDModel.find(
        {
          usuario: getUserIdFromRequest(req),
          inativo: false,
          bolsista: false
        } as Alunos.Types.IAlunoModel)
        .select('_id nome ultimaAtivacao mensalidades');

      const alunosComMensalidadesVencidas = alunos.filter(aluno => {
        const { ultimaAtivacao, mensalidades } = aluno;
        let haMensalidadeVencida = false;
        const dataAtual = new Date();
        const mensalidadesFechadas = mensalidades.filter(mensalidade => mensalidade.situacao == "Fechada")

        let mesesAComparar = monthDiff(ultimaAtivacao, dataAtual);

        if (mesesAComparar == 0) {
          mesesAComparar++;
        }

        if (dataAtual.getDay() >= configuracao.diaVencimentoMensalidade) {
          mesesAComparar--;
        }

        haMensalidadeVencida = mesesAComparar > mensalidadesFechadas.length;

        return haMensalidadeVencida;
      }).map(({ _id, nome }) => ({ _id, nome }));

      return res.status(200).json(alunosComMensalidadesVencidas);
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }

  async find(req: express.Request, res: express.Response) {
    const { filters, select } = req.body as IBuscaParameters;
    try {
      let query = AlunoCRUDModel.find({ usuario: getUserIdFromRequest(req) })

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
