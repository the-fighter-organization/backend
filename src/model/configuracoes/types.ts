import * as mongoose from 'mongoose';

export namespace Configuracoes.Types {
    export interface IConfiguracao extends mongoose.Document {
        valorMensalidade: number;
        diaVencimentoMensalidade: Number;
        usuario: mongoose.Schema.Types.ObjectId;
    }
}