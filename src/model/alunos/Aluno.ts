import * as mongoose from "mongoose";
import { USER_MODEL_NAME, IUserModel } from "../usuarios/Usuario";
import './types'
import { Alunos } from "./types";

export interface IAlunoModel extends mongoose.Document {
  // Dados do aluno
  nome: string;
  dataNascimento: Date;
  cpf:string;
  rg:string;
  orgaoEmissor:string;
  dataExpedicao:string;
  sexo: Alunos.Types.Sexo;
  nacionalidade: Alunos.Types.Nacionalidade;
  naturalidade: Alunos.Types.Nacionalidade;
  numeroZempo:string;
  numeroFiliacao:string;
  // Filiação e responsáveis
  responsaveis:[Alunos.Types.IResponsavel];
  // Endereço  
  endereco: [Alunos.Types.IEndereco],
  // Contato
  telefone:string;
  email:string;
  // Escolaridade
  instituicaoEnsino:string;
  periodo: Alunos.Types.PeriodoEnsino;
  ano:string;
  // Demais Informações
  graduacaoAtual:string;
  pesoAtual: number;
  alturaAtual:number;
  dataUltimaGraduacao:Date;
  categoria:string;
  tipoSanguineo:string;
  dataFiliacao:Date;
  situacaoFejur:string;
  situacaoFbj:string;
  observacoesMedicas:string;
  // Administrativo
  inativo:boolean;
  usuario: mongoose.Schema.Types.ObjectId
}

export interface IAlunoResponse {
  // Dados do aluno
  nome: string;
  dataNascimento: Date;
  cpf:string;
  rg:string;
  orgaoEmissor:string;
  dataExpedicao:string;
  sexo: Alunos.Types.Sexo;
  nacionalidade: Alunos.Types.Nacionalidade;
  naturalidade: Alunos.Types.Nacionalidade;
  numeroZempo:string;
  numeroFiliacao:string;
  // Filiação e responsáveis
  responsaveis:Alunos.Types.IResponsavel[];
  // Endereço  
  endereco: Alunos.Types.IEndereco,
  // Contato
  telefone:string;
  email:string;
  // Escolaridade
  instituicaoEnsino:string;
  periodo: Alunos.Types.PeriodoEnsino;
  ano:string;
  // Demais Informações
  graduacaoAtual:string;
  pesoAtual: number;
  alturaAtual:number;
  dataUltimaGraduacao:Date;
  categoria:string;
  tipoSanguineo:string;
  dataFiliacao:Date;
  situacaoFejur:string;
  situacaoFbj:string;
  observacoesMedicas:string;
  // Administrativo
  inativo:boolean;
  dataRegistro:Date;
  usuario: IUserModel
}


export const ALUNO_MODEL_NAME = "alunos";
// Endereços
const enderecoSchema = new mongoose.Schema<Alunos.Types.IEndereco>({
  logradouro: {
    type: String,
    required: [true, "O logradouro é obrigatório!"],
    maxlength: [50, "O logradouro deve ter no máximo 40 caracteres!"]
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
  cep: {
    type: String,
    required: [true, "O CEP é obrigatório!"],
    maxlength: [8, "O CEP deve ter no máximo 8 caracteres!"]
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
  rg: {
    type: String,
    required: [true, "O RG é obrigatório!"],
    maxlength: [11, "O RF deve ter 11 caracteres"]
  },
  orgaoEmissor: {
    type: String,
    // required: [true, "O órgão emissor é obrigatório!"],
    maxlength: [30, "O órgão emissor deve ter 30 caracteres"]
  },
  dataExpedicao: {
    type: Date,
    // required: [true, "A data de expedição é obrigatório!"],
  },
  telefone: {
    type:String,
    required:[true, "O telefone é obrigatório"],
    maxlength: [15, "O telefone deve ter no máximo 15 caracteres!"]
  },
  nivelParentesco: {
    type:Alunos.Types.NivelParentesco,
    required:[true, "O nível de parentesco é obrigatório"],
  },
  observacao: String
});

const alunoCRUDSchema = new mongoose.Schema({
  // Dados do aluno
  nome: {
    type: String,
    required: [true, "O nome do aluno é obrigatório!"],
    maxlength: [40, "O nome deve ter no máximo 40 caracteres"]
  },
  dataNascimento: {
    type: Date,
    required: [true, "A data de nascimento é obrigatória!"]
  },
  cpf: {
    type: String,
    required: [true, "O CPF é obrigatório!"],
    minlength: [11, "O CPF deve ter 11 caracteres"],
    maxlength: [11, "O CPF deve ter 11 caracteres"]
  },
  rg: {
    type: String,
    required: [true, "O RG é obrigatório!"],
    maxlength: [11, "O RF deve ter 11 caracteres"]
  },
  orgaoEmissor: {
    type: String,
    // required: [true, "O órgão emissor é obrigatório!"],
    maxlength: [30, "O órgão emissor deve ter 30 caracteres"]
  },
  dataExpedicao: {
    type: Date,
    // required: [true, "A data de expedição é obrigatório!"],
  },
  sexo:{
    type: Alunos.Types.Sexo,
    required: [true, "O sexo é obrigatório"]
  },
  nacionalidade:{
    type: String,
    required: [true, "A nacionalidade é obrigatória"],
    maxlength: [100, "A nacionalidade deve ter no máximo 100 caracteres"]
  },
  naturalidade:{
    type: String,
    maxlength: [100, "A naturalidade deve ter no máximo 100 caracteres"]
  },
  numeroZempo:{
    type: String,
    // required: [true, "O N° Zempo é obrigatório"],
    maxlength: [20, "O N° Zempo deve ter no máximo 20 caracteres"]
  },
  numeroFiliacao:{
    type: String,
    // required: [true, "O N° de filiação é obrigatório"],
    maxlength: [20, "O N° de filiação deve ter no máximo 20 caracteres"]
  },
  situacaoCbj:{
    type: Alunos.Types.SituacaoCBJ,
    // required: [true, "A situação da CBJ é obrigatória"],
  },
  // Filiação e responsáveis
  responsaveis:[responsavelSchema],
  // Endereço
  endereco: enderecoSchema,
  // Contato
  telefone:{
    type:String,
    required: [true, "O telefone é obrigatório!"],
    maxlength: [20, "O telefone deve ter no máximo 20 caracteres!"]
  },
  email:{
    type:String,
    // required: [true, "O email é obrigatório!"],
    maxlength: [60, "O email deve ter no máximo 60 caracteres!"]
  },
  // Escolaridade
  instituicaoEnsino:{
    type:String,
    maxlength: [80, "A instituição de ensino deve ter no máximo 80 caracteres!"]
  },
  periodo:{
    type:Alunos.Types.PeriodoEnsino,
  },
  ano:{
    type:String,
    maxlength: [20, "O ano deve ter no máximo 20 caracteres!"]
  },
  // Demais informações
  graduacaoAtual:{
    type:String,
    maxlength: [20, "A graduação atual deve ter no máximo 20 caracteres!"]
  },
  pesoatual:Number,
  alturaAtual:Number,
  dataUltimaGraduacao:Date,
  categoria:{
    type:String,
    maxlength: [20, "A categoria deve ter no máximo 20 caracteres!"]
  },
  tipoSanguineo:{
    type:String,
    maxlength: [20, "O tipo sanguíneo deve ter no máximo 20 caracteres!"]
  },
  dataFiliacao:Date,
  situacaoFejur:{
    type:String,
    maxlength: [20, "A situação da Fejur deve ter no máximo 20 caracteres!"]
  },
  situacaoFbj:{
    type:String,
    maxlength: [20, "A situação da FBJ deve ter no máximo 20 caracteres!"]
  },
  observacoesMedicas:{
    type:String,
    maxlength: [300, "As observações médicas devem ter no máximo 300 caracteres!"]
  },
  // Administrativo
  inativo: {
    type: Boolean,
    default:false
  },
  dataRegistro:{
    type:Date,
    default: new Date()
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
