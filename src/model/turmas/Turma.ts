import * as mongoose from 'mongoose'
import { Turmas } from './types'
import { ALUNO_MODEL_NAME } from '../alunos/Aluno';
import { USER_MODEL_NAME } from '../usuarios/Usuario';

const TURMA_MODEL_NAME = "turmas";

const AlunoPresencaSchema = new mongoose.Schema({
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ALUNO_MODEL_NAME,
    required: [true, 'O aluno dessa presença é requerido!']
  },
  presente: {
    type: Boolean,
    required: [true, 'O campo "Presente" é requerido!']
  },
  observacoesPositivas: [String],
  observacoesNegativas: [String],
  nota: Number
})

const AulaSchema = new mongoose.Schema<Turmas.IAulaModel>({
  dataRegistro: { type: Date, required: true },
  dataAula: { type: Date, required: true },
  dataChamada: { type: Date },
  presencas: [AlunoPresencaSchema],
  planoAula: [String]
});

const TurmaSchema = new mongoose.Schema<Turmas.ITurmaModelRequest>({
  nome: {
    type: String,
    required: true
  },
  arteMarcial: {
    type: String,
    required: true
  },
  localTreino: {
    type: String,
    required: true
  },
  colaboradores: [{
    type: String
  }],
  aulas: [AulaSchema],
  alunos: [{ type: mongoose.Schema.Types.ObjectId, ref: ALUNO_MODEL_NAME, }],
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
    required: [true, 'O usuário criador é requerido!']
  },
  //Funções administrativas
  inativo: Boolean,
  dataRegistro: {
    type: Date,
    required: true,
    default: new Date()
  }
})

export const TurmaCRUDModel = mongoose.model<Turmas.ITurmaModelRequest>(
  TURMA_MODEL_NAME,
  TurmaSchema,
  TURMA_MODEL_NAME
)
