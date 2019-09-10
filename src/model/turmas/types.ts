import * as mongoose from 'mongoose';

export namespace Turmas {
  export interface ITurmaModel extends mongoose.Document {
    arteMarcial: string;
    localTreino: string;
    colaboradores: string[];
    aulas: IAulaModel[];
    // Administrativo
    inativo: boolean;
    usuario: mongoose.Schema.Types.ObjectId
  }

  export interface IAulaModel {
    dataRegistro: Date;
    dataAula: Date;
    dataChamada: Date;
    presencas: IAulaPresencaModel[];
  }

  export interface IAulaPresencaModel {
    aluno: mongoose.Schema.Types.ObjectId;
    observacoesPositivas: string[];
    observacoesNegativas: string[];
    nota: number;
  }
}