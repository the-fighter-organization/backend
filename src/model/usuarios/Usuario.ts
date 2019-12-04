import * as mongoose from "mongoose";
import * as jwt from "jsonwebtoken";

export interface IUserModel extends mongoose.Document {
  nome?: string;
  sobrenome?: string;
  email: string;
  senha: string;
  senhaAConfirmar: string;
  logoEmpresa?: string;
  codigoConfirmacao?: string;
}

export interface IUserNovoModel extends mongoose.Document {
  nome?: string;
  sobrenome?: string;
  email: string;
  senha: string;
  logoEmpresa?: string;
  codigoConfirmacao?: string;
}

export interface IUserLoginModel extends mongoose.Document {
  email: string;
  senha: string;
  authenticate: (usuario?: string, senha?: string) => Promise<
    IUserAuthenticationResponse
  >;
}

export interface IUserEditarPerfilModel extends mongoose.Document {
  nome: string;
  sobrenome?: string;
  email: string;
  logoEmpresa?: string;
}

export interface IUserEditarSenhaModel extends mongoose.Document {
  email: string
  senha: string
  confirmacaoSenha: string
}

export interface IUserInfo {
  nome: string;
  sobrenome: string;
  email: string;
}

export interface IUserAuthenticationResponse {
  token: string;
  userInfo: IUserInfo;
  error?: string
}

export const USER_MODEL_NAME = "usuarios";
export const USER_MODEL_LOGIN_NAME = "UsuarioLogin";
export const USER_MODEL_NOVO_NAME = "UsuarioNovo";
export const USER_MODEL_EDITAR_PERFIL_NAME = "UsuarioEditarPerfil";
export const USER_MODEL_EDITAR_SENHA_NAME = "UsuarioEditarSenha";

const userCRUDSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome de usuário é obrigatório!"],
    maxlength: [40, "O nome deve ter no máximo 40 caracteres"]
  },
  sobrenome: {
    type: String,
    maxlength: [40, "O sobrenome deve ter no máximo 40 caracteres"]
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
  },
  senhaAConfirmar: {
    type: String,
    maxlength: [40, "A senha deve ter no máximo 40 caracteres"]
  },
  logoEmpresa: {
    type: String
  },
  codigoConfirmacao: {
    type: String
  }
});

const userNovoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome de usuário é obrigatório!"],
    maxlength: [40, "O nome deve ter no máximo 40 caracteres"]
  },
  sobrenome: {
    type: String,
    maxlength: [40, "O sobrenome deve ter no máximo 40 caracteres"]
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
  },
  logoEmpresa: {
    type: String
  },
  codigoConfirmacao: {
    type: String
  }
});

const userLoginSchema = new mongoose.Schema({
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

const userEditarPerfilSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome de usuário é obrigatório!"],
    maxlength: [40, "O nome deve ter no máximo 40 caracteres"]
  },
  sobrenome: {
    type: String,
    maxlength: [40, "O sobrenome deve ter no máximo 40 caracteres"]
  },
  logoEmpresa: {
    type: String
  }
});

const userEditarSenhaSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "O e-mail é obrigatório!"],
    maxlength: [60, "O e-mail deve ter no máximo 40 caracteres"]
  },
  senha: {
    type: String,
    required: [true, "A senha é obrigatória!"],
    maxlength: [40, "A senha deve ter no máximo 40 caracteres"]
  },
  confirmacaoSenha: {
    type: String,
    required: [true, "A confirmação de senha é obrigatória!"],
    maxlength: [40, "A confirmação de senha deve ter no máximo 40 caracteres"]
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

    if (user.codigoConfirmacao && !user.senhaAConfirmar) {
      return { token: null, userInfo: null, error: "Para fazer login é necessário confirmar a criação da sua conta!" };
    }

    const token = jwt.sign(
      {
        email: user.email,
        nome: user.nome,
        sobrenome: user.sobrenome,
        _id: user._id,
        generatedDate: new Date()
      },
      process.env.SECRET,
      {
        expiresIn: '2h'
      }
    );

    return { token, userInfo: { email: user.email, nome: user.nome, sobrenome: user.sobrenome } } as IUserAuthenticationResponse;
  } catch (error) {
    throw error
  }
};

export const UserCRUDModel = mongoose.model<IUserModel>(
  USER_MODEL_NAME,
  userCRUDSchema,
  USER_MODEL_NAME
);

export const UserNovoModel = mongoose.model<IUserNovoModel>(
  USER_MODEL_NOVO_NAME,
  userNovoSchema,
  USER_MODEL_NAME
);

export const UserLoginModel = mongoose.model<IUserLoginModel>(
  USER_MODEL_LOGIN_NAME,
  userLoginSchema,
  USER_MODEL_NAME
);

export const UserEditarPerfilModel = mongoose.model<IUserEditarPerfilModel>(
  USER_MODEL_EDITAR_PERFIL_NAME,
  userEditarPerfilSchema,
  USER_MODEL_NAME
);

export const UserEditarSenhaModel = mongoose.model<IUserEditarSenhaModel>(
  USER_MODEL_EDITAR_SENHA_NAME,
  userEditarSenhaSchema,
  USER_MODEL_NAME
);
