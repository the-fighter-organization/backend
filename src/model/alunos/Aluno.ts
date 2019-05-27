import * as mongoose from "mongoose";
import { IPaiAlunoModel } from "../paisAlunos/PaiAluno";
import { IUserModel } from "../usuarios/Usuario";

export interface IAlunoModel extends mongoose.Document {
  nome: string;
  dataNascimento: Date;
  enderecos: [{
    rua:string,
    numero:string,
    bairro:string,
    cidade:string,
    uf:string
  }],
  inativo:boolean;
  responsavel:mongoose.Schema.Types.ObjectId;
  usuario: mongoose.Schema.Types.ObjectId
}

export interface IAlunoResponse {
  _id: mongoose.Schema.Types.ObjectId;
  nome: string;
  dataNascimento: Date;
  enderecos: [{
    rua:string,
    numero:string,
    bairro:string,
    cidade:string,
    uf:string
  }],
  inativo:boolean;
  responsavel:IPaiAlunoModel;
  usuario: IUserModel
}

export const ALUNO_MODEL_NAME = "alunos";

const alunoCRUDSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome do aluno é obrigatório!"],
    maxlength: [40, "O nome deve ter no máximo 40 caracteres"]
  },
  dataNascimento: {
    type: Date,
    required: [true, "A data de nascimento é obrigatória!"]
  },
  enderecos: [{
    rua: String,
    numero: String,
    bairro: String,
    cidade: String,
    uf: String
  }],
  inativo: {
    type: Boolean
  },
  responsavel:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'paisAlunos'
  },
  usuario:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios'
  }
});

export const AlunoCRUDModel = mongoose.model<IAlunoModel>(
  ALUNO_MODEL_NAME,
  alunoCRUDSchema,
  ALUNO_MODEL_NAME
);
