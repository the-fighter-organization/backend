import * as mongoose from 'mongoose';
import { Alunos } from '../alunos/types';

export namespace Turmas {
  export interface ITurmaModel extends mongoose.Document {
    nome: string;
    arteMarcial: string;
    localTreino: string;
    colaboradores: string[];
    aulas: IAulaModel[];
    alunos: mongoose.Schema.Types.ObjectId[];
    // Administrativo
    dataRegistro: Date;
    inativo: boolean;
    usuario: mongoose.Schema.Types.ObjectId
  }

  export interface ITurmaModelResponse extends mongoose.Document {
    nome: string;
    arteMarcial: string;
    localTreino: string;
    colaboradores: string[];
    aulas: IAulaModel[];
    alunos: Alunos.Types.IAlunoModel[];
    // Administrativo
    dataRegistro: Date;
    inativo: boolean;
    usuario: mongoose.Schema.Types.ObjectId
  }

  export interface IAulaModel {
    _id: mongoose.Schema.Types.ObjectId;
    dataRegistro: Date;
    dataAula: Date;
    dataChamada: Date;
    presencas: IAulaPresencaModel[];
    planoAula: string[];
    turma?: ITurmaModel;
  }

  export interface IAulaPresencaModel {
    _id: mongoose.Schema.Types.ObjectId;
    aluno: mongoose.Schema.Types.ObjectId;
    observacoesPositivas: string[];
    observacoesNegativas: string[];
    nota: number;
  }
}