import * as mongoose from 'mongoose';

export namespace Turmas {
  export interface ITurmaModel extends mongoose.Document {
    nome: string;
    arteMarcial: string;
    localTreino: string;
    colaboradores: string[];
    aulas: IAulaModel[];
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
  }

  export interface IAulaPresencaModel {
    _id: mongoose.Schema.Types.ObjectId;
    aluno: mongoose.Schema.Types.ObjectId;
    observacoesPositivas: string[];
    observacoesNegativas: string[];
    nota: number;
  }
}