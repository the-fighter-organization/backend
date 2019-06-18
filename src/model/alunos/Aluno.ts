import * as mongoose from "mongoose";
import { USER_MODEL_NAME, IUserModel } from "../usuarios/Usuario";
import './types'
import { Alunos } from "./types";

export interface IAlunoModel extends mongoose.Document {
  nome: string;
  dataNascimento: Date;
  cpf:string;
  rg:string;
  sexo: Alunos.Types.Sexo;
  nacionalidade: Alunos.Types.Nacionalidade;
  naturalidade: Alunos.Types.Nacionalidade;
  numeroZempo:string;
  numeroFiliacao:string;
  endereco: Alunos.Types.IEndereco,
  telefone:string;
  email:string;
  instituicaoEnsino:string;
  periodo: Alunos.Types.PeriodoEnsino;
  ano:string;
  responsaveis:mongoose.Schema.Types.ObjectId[];
  inativo:boolean;
  usuario: mongoose.Schema.Types.ObjectId
}

export interface IAlunoResponse {
  _id: mongoose.Schema.Types.ObjectId;
  nome: string;
  dataNascimento: Date;
  endereco: Alunos.Types.IEndereco,
  inativo: boolean;
  responsaveis: Alunos.Types.IResponsavel[];
  usuario: IUserModel
}


export const ALUNO_MODEL_NAME = "alunos";
// Endereços
const enderecoSchema = new mongoose.Schema<Alunos.Types.IEndereco>({
  rua: {
    type: String,
    required: [true, "A rua é obrigatória!"],
    maxlength: [50, "A rua deve ter no máximo 40 caracteres!"]
  },
  numero: {
    type: String,
    required: [true, "O número é obrigatório!"],
    maxlength: [12, "O número deve ter no máximo 12 caracteres!"]
  },
  bairro: {
    type: String,
    required: [true, "O bairro é obrigatório!"],
    maxlength: [40, "O bairro deve ter no máximo 40 caracteres!"]
  },
  cidade: {
    type: String,
    required: [true, "A cidade é obrigatória!"],
    maxlength: [60, "A cidade deve ter no máximo 60 caracteres!"]
  },
  uf: {
    type: String,
    required: [true, "A UF é obrigatória!"],
    maxlength: [2, "A UF deve ter no máximo 2 caracteres!"]
  }
});

// Responsável
const responsavelSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome do responsável é obrigatório!"],
    maxlength: [40, "O nome do responsável ter no máximo 40 caracteres"]
  },
  cpf: {
    type: String,
    required: [true, "O CPF é obrigatório!"],
    minlength: [11, "O CPF deve ter 11 caracteres"],
    maxlength: [11, "O CPF deve ter 11 caracteres"]
  },
  endereco: enderecoSchema,
  telefone: {
    type:String,
    required:[true, "O telefone é obrigatório"],
    maxlength: [15, "O telefone deve ter no máximo 15 caracteres!"]
  }
});

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
  endereco: enderecoSchema,
  inativo: {
    type: Boolean,
    default:false
  },
  responsavel:responsavelSchema,
  dataRegistro:{
    type:Date,
    default: new Date()
  },
  telefone:{
    type:String,
    required: [true, "O telefone é obrigatório!"],
    maxlength: [20, "O telefone deve ter no máximo 20 caracteres!"]
  },
  usuario:{
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
    required:[true, "O usuário criador é requerido!"]
  }
});

export const AlunoCRUDModel = mongoose.model<IAlunoModel>(
  ALUNO_MODEL_NAME,
  alunoCRUDSchema,
  ALUNO_MODEL_NAME
);
