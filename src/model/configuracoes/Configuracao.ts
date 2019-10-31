import * as mongoose from 'mongoose';
import './types'
import { Configuracoes } from './types';
import { USER_MODEL_NAME } from '../usuarios/Usuario';

export const CONFIGURACAO_MODEL_NAME = 'configuracoes';

const configuracaoCRUDSchema = new mongoose.Schema({
  valorMensalidade: {
    required: true,
    type: Number,
    min: 0
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
    required: [true, 'O usuário criador é requerido!']
  }
});

export const ConfiguracaoCRUDModel = mongoose.model<Configuracoes.Types.IConfiguracao>(
  CONFIGURACAO_MODEL_NAME,
  configuracaoCRUDSchema,
  CONFIGURACAO_MODEL_NAME
);
