import * as express from "express";
import { UserCRUDModel as UserCRUDModel, UserLoginModel, UserEditarPerfilModel, UserEditarSenhaModel, UserNovoModel } from '../model/usuarios/Usuario';
const CryptoJS = require("crypto-js");
import { passwordHash } from '../config/secrets.json'
import { getUserIdFromRequest } from "../util/userModelShortcuts";
import { uuidv4 } from "../util/GUID";
import { createTransport } from 'nodemailer';
import { envioEmail } from '../config/secrets.json'

export default class UsuarioService {
  async novo(req: express.Request, res: express.Response) {
    const { _id, ...body } = req.body;

    let model = new UserNovoModel(body);
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    model.senha = CryptoJS.HmacSHA1(model.senha, passwordHash).toString()
    model.codigoConfirmacao = uuidv4();

    try {
      model = await model.save();

      if (model === null) {
        throw new Error('Usuário não criado!')
      }

      var transporter = createTransport({
        service: 'gmail',
        auth: {
          user: envioEmail.email,
          pass: envioEmail.senha
        }
      });

      const link = `${req.body.linkConfirmacao}/${model._id}/${model.codigoConfirmacao}`

      var mailOptions = {
        from: envioEmail.email,
        to: model.email,
        subject: 'Criação de conta - Warrior',
        html: `<span>Clique nesse link para confirmar a criação da sua conta: <a href="${link}">${link}</a></span>`
      };

      const emailResponse = await transporter.sendMail(mailOptions);

      const { senha, senhaAConfirmar, logoEmpresa, codigoConfirmacao, ...response } = model.toObject();

      return res.status(200).json({ response, emailResponse });

    } catch (error) {
      if (!error) {
        return res.status(500).json("Ocorreu um erro interno no servidor");
      }
      // validando erros
      if (error.code === 11000) {
        return res.status(400).json({ error: "Este e-mail já está sendo usado por outra conta!" })
      }
      if (error.code === "ESOCKET" && error.errno === "ETIMEDOUT") {
        await UserCRUDModel.findOneAndRemove({ _id: model._id })
        return res.status(500).json({ error: "Não foi possível enviar o e-mail ao usuário. A operação foi cancelada!" })
      }

      return res.status(500).json({ error });
    }
  }

  async editarSenha(req: express.Request, res: express.Response) {
    let body = new UserEditarSenhaModel(req.body);
    let validation = body.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    if (body.senha !== body.confirmacaoSenha) {
      return res.status(400).json({ error: 'A confirmação de senha está diferente da senha!' })
    }

    body.senha = CryptoJS.HmacSHA1(body.senha, passwordHash).toString()

    let model = await UserCRUDModel.findOne({ email: body.email });
    model.codigoConfirmacao = uuidv4();
    model.senhaAConfirmar = body.senha;

    try {
      model = await UserCRUDModel
        .findOneAndUpdate({ _id: model._id }, model, { new: true })
        .select(['-senha', '-senhaAConfirmar', '-logoEmpresa', '-logoEmpresa'])

      if (model === null) {
        throw 'Usuário não encontrado!'
      }

      var transporter = createTransport({
        service: 'gmail',
        auth: {
          user: envioEmail.email,
          pass: envioEmail.senha
        }
      });

      const link = `${req.body.linkConfirmacao}/${model._id}/${model.codigoConfirmacao}`

      var mailOptions = {
        from: envioEmail.email,
        to: model.email,
        subject: 'Alteração de senha - Warrior',
        html: `<span>Clique nesse link para confirmar sua alteração de senha: <a href="${link}">${link}</a></span>`
      };

      const emailResponse = await transporter.sendMail(mailOptions);

      return res.status(200).json({ model, emailResponse });

    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async editarPerfil(req: express.Request, res: express.Response) {
    let model = new UserEditarPerfilModel({ ...req.body, _id: getUserIdFromRequest(req) });
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    try {
      model = await UserEditarPerfilModel
        .findOneAndUpdate({ _id: model._id }, model, { new: true })
        .select(['-senha', '-codigoConfirmacao', '-senhaAConfirmar', '-logoEmpresa'])

      if (model === null) {
        throw 'Usuário não encontrado!'
      }

      return res.status(200).json(model);

    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async confirmarPerfil(req: express.Request, res: express.Response) {
    try {
      const { id, codigoConfirmacao } = req.params;
      let obj = await UserCRUDModel.findOne({ _id: id, codigoConfirmacao });

      console.log(obj)
      if (!obj || !obj._id) {
        throw "Registro a confirmar não encontrado!";
      }

      if (obj.senhaAConfirmar) {
        obj.senha = obj.senhaAConfirmar;
        obj.senhaAConfirmar = null;
      }

      obj.codigoConfirmacao = null;
      const model = await obj.save();

      const { senha, senhaAConfirmar, logoEmpresa, codigoConfirmacao: confirmacao, ...response } = model.toObject();

      return res.status(200).json(response);
    }
    catch (error) {
      return res.status(500).json(error)
    }
  }

  async authenticate(req: express.Request, res: express.Response) {
    let model = new UserLoginModel(req.body);
    let validation = model.validateSync();

    if (validation) {
      return res.status(400).json({ validation });
    }

    try {
      let senha = CryptoJS.HmacSHA1(model.senha, passwordHash)
      let response = await model.authenticate(model.email, senha.toString())

      if (!response) {
        return res.status(401).json({ message: "Usuário ou senha incorretos!" })
      }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async remove(req: express.Request, res: express.Response) {
    try {
      let model = await UserCRUDModel
        .findOneAndRemove({ _id: getUserIdFromRequest(req) })
        .select(['-senha', '-codigoConfirmacao', '-senhaAConfirmar', '-logoEmpresa']);

      return res.status(200).json(model);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async findOne(req: express.Request, res: express.Response) {
    try {
      let result = await UserCRUDModel
        .findOne({ _id: getUserIdFromRequest(req) })
        .select(['-senha', '-codigoConfirmacao', '-senhaAConfirmar']);

      if (result) {
        return res.status(200).json(result)
      } else {
        return res.status(404).json({ error: 'Registro não encontrado!' });
      }
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}
