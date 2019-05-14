import * as mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import { secret } from "../../config/authentication.config.json";

export interface IUserModel extends mongoose.Document {
  nome: string;
  email: string;
  senha: string;
  authenticate: () => {};
}

export interface IUserInfo {
  nome: string;
  email: string;
}

export interface IUserAuthenticationResponse {
  token: string;
  userInfo: IUserInfo;
}

export const USER_MODEL_NAME = "Usuario";

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome de usuário é obrigatório!"],
    maxlength: [40, "O nome deve ter no máximo 40 caracteres"]
  },
  email: {
    type: String,
    required: [true, "O e-mail é obrigatório!"],
    maxlength: [40, "O email deve ter no máximo 40 caracteres"]
  },
  senha: {
    type: String,
    required: [true, "A senha é obrigatória!"],
    maxlength: [40, "A senha deve ter no máximo 40 caracteres"]
  }
});

userSchema.methods.authenticate = async (): Promise<
  IUserAuthenticationResponse
> => {
  const model = this as IUserModel;
  const { senha, ...propsSemSenha } = model;
  const { email } = propsSemSenha;

  const user = await model
    .model(USER_MODEL_NAME)
    .findOne({ email, senha } as IUserModel);

  if (!user) {
    return null;
  }

  const token = jwt.sign(
    {
      email: user.email,
      nome: user.nome,
      _id: user._id,
      generatedDate: new Date(),
      exp: new Date()
    },
    secret
  );

  return { token, userInfo: { email: user.email, nome: user.nome } };
};

export const UserModel = mongoose.model<IUserModel>(
  USER_MODEL_NAME,
  userSchema
);
