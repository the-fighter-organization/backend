import nodemailer from 'nodemailer';

import {
  UserCRUDModel as UserCRUDModel,
  UserEditarPerfilModel,
  UserEditarSenhaModel,
  UserLoginModel,
  UserNovoModel,
} from '../model/usuarios/Usuario';
import { uuidv4 } from '../util/GUID';
import { getUserIdFromRequest } from '../util/userModelShortcuts';
import HmacSHA1 from "crypto-js/hmac-sha1";

export default class UsuarioService {
  async novo(req, res) {
      const { _id, ...body } = req.body;

      var model = new UserNovoModel(body);
      const validation = model.validateSync();
    try {

      if (validation) {
        return res.status(400).json({ validation });
      }

      model.senha = HmacSHA1(model.senha, process.env.PASSWORD_HASH).toString()
      // model.codigoConfirmacao = uuidv4();

      model = await model.save();

      if (!model) {
        throw new Error('Usuário não criado!')
      }

      // var transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: process.env.ENVIO_EMAIL_CONTA,
      //     pass: process.env.ENVIO_EMAIL_SENHA
      //   }
      // });

      // const link = `${req.body.linkConfirmacao}/${model._id}/${model.codigoConfirmacao}`

      // var mailOptions = {
      //   from: process.env.ENVIO_EMAIL_CONTA,
      //   to: model.email,
      //   subject: 'Criação de conta - Warrior',
      //   html: `<span>Clique nesse link para confirmar a criação da sua conta: <a href="${link}">${link}</a></span>`
      // };

      // const emailResponse = await transporter.sendMail(mailOptions);

      const { senha, senhaAConfirmar, logoEmpresa, codigoConfirmacao, ...response } = model.toObject();

      return res.status(200).json({ response });

    } catch (error) {
      if (!error) {
        return res.status(500).json("Ocorreu um erro interno no servidor");
      }
      // validando erros
      if (error && error.code === 11000) {
        return res.status(400).json({ error: "Este e-mail já está sendo usado por outra conta!" })
      }
      if (error && error.code === "ESOCKET" && error.errno === "ETIMEDOUT") {
        await UserCRUDModel.findOneAndRemove({ _id: model._id })
        return res.status(500).json({ error: "Não foi possível enviar o e-mail ao usuário. A operação foi cancelada!" })
      }

      return res.status(500).json({ error });
    }
  }

  async editarSenha(req, res) {
    try {
      let body = new UserEditarSenhaModel(req.body);
      let validation = body.validateSync();

      if (validation) {
        return res.status(400).json({ validation });
      }

      if (body.senha !== body.confirmacaoSenha) {
        return res.status(400).json({ error: 'A confirmação de senha está diferente da senha!' })
      }

      body.senha = HmacSHA1(body.senha, process.env.PASSWORD_HASH).toString()

      let model = await UserCRUDModel.findOne({ email: body.email });
      // model.codigoConfirmacao = uuidv4();
      // model.senhaAConfirmar = body.senha;

      model = await UserCRUDModel
        .findOneAndUpdate({ _id: model._id }, model, { new: true })
        .select(['-senha', '-senhaAConfirmar', '-logoEmpresa', '-logoEmpresa'])

      if (model === null) {
        throw 'Usuário não encontrado!'
      }

      // var transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: process.env.ENVIO_EMAIL_CONTA,
      //     pass: process.env.ENVIO_EMAIL_SENHA
      //   }
      // });

      // const link = `${req.body.linkConfirmacao}/${model._id}/${model.codigoConfirmacao}`

      // var mailOptions = {
      //   from: process.env.ENVIO_EMAIL_CONTA,
      //   to: model.email,
      //   subject: 'Alteração de senha - Warrior',
      //   html: `<span>Clique nesse link para confirmar sua alteração de senha: <a href="${link}">${link}</a></span>`
      // };

      // const emailResponse = await transporter.sendMail(mailOptions);

      return res.status(200).json({ model });

    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async editarPerfil(req, res) {
    try {
      let model = new UserEditarPerfilModel({ ...req.body, _id: getUserIdFromRequest(req) });
      let validation = model.validateSync();

      if (validation) {
        return res.status(400).json({ validation });
      }

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

  async confirmarPerfil(req, res) {
    try {
      const { id, codigoConfirmacao } = req.params;
      let obj = await UserCRUDModel.findOne({ _id: id, codigoConfirmacao });

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

  async authenticate(req, res) {
    try {
      debugger

      let model = new UserLoginModel(req.body);
      let validation = model.validateSync();

      if (validation) {
        return res.status(400).json({ validation });
      }

      let senha = HmacSHA1(model.senha, process.env.PASSWORD_HASH)
      let response = await model.authenticate(model.email, senha.toString())

      if (!response) {
        return res.status(401).json({ message: "Usuário ou senha incorretos!" })
      }

      // if(response.faltaConfirmarSenha){
      //   return res.status(401).json({message: "Não é possível fazer login enquanto não confirmar a conta por e-mail."})
      // }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async remove(req, res) {
    try {
      let model = await UserCRUDModel
        .findOneAndRemove({ _id: getUserIdFromRequest(req) })
        .select(['-senha', '-codigoConfirmacao', '-senhaAConfirmar', '-logoEmpresa']);

      return res.status(200).json(model);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async findOne(req, res) {
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
