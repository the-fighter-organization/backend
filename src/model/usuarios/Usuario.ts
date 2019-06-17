import * as mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import { secret } from "../../config/authentication.config.json";

export interface IUserModel extends mongoose.Document {
  nome: string;
  email: string;
  senha: string;
}

export interface IUserLoginModel extends mongoose.Document {
  nome?: string;
  email: string;
  senha: string;
  authenticate: (usuario?: string, senha?: string) => Promise<
    IUserAuthenticationResponse
  >;
}

export interface IUserInfo {
  nome: string;
  email: string;
}

export interface IUserAuthenticationResponse {
  token: string;
  userInfo: IUserInfo;
}

export const USER_MODEL_NAME = "usuarios";
export const USER_MODEL_LOGIN_NAME = "UsuarioLogin";

const userCRUDSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome de usuário é obrigatório!"],
    maxlength: [40, "O nome deve ter no máximo 40 caracteres"]
  },
  email: {
    type: String,
    required: [true, "O e-mail é obrigatório!"],
    maxlength: [40, "O email deve ter no máximo 40 caracteres"],
    unique: [true, "Esse e-mail já está sendo usado!"],
    index: true
  },
  senha: {
    type: String,
    required: [true, "A senha é obrigatória!"],
    maxlength: [40, "A senha deve ter no máximo 40 caracteres"]
  }
});

const userLoginSchema = new mongoose.Schema({
  nome: {
    type: String,
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

userLoginSchema.methods.authenticate = async (email?: string, senha?: string): Promise<
  IUserAuthenticationResponse
> => {
  try {
    const user = await UserCRUDModel
      .findOne({ email, senha } as IUserModel);

    if (!user) {
      return null;
    }

    const token = jwt.sign(
      {
        email: user.email,
        nome: user.nome,
        _id: user._id,
        generatedDate: new Date()
      },
      secret,
      {
        expiresIn : '2h'
      }
    );

    return { token, userInfo: { email: user.email, nome: user.nome } } as IUserAuthenticationResponse;
  } catch (error) {
    throw error
  }
};

export const UserCRUDModel = mongoose.model<IUserModel>(
  USER_MODEL_NAME,
  userCRUDSchema,
  USER_MODEL_NAME
);

export const UserLoginModel = mongoose.model<IUserLoginModel>(
  USER_MODEL_LOGIN_NAME,
  userLoginSchema,
  USER_MODEL_NAME
);
