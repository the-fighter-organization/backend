import * as mongoose from "mongoose";

export interface IPaiAlunoModel extends mongoose.Document {
  nome: string;
  cpf: string;
  enderecos: [{
    rua: string,
    numero: string,
    bairro: string,
    cidade: string,
    uf: string
  }];
  inativo: boolean;
}

export const PAI_ALUNO_MODEL_NAME = "paisAlunos";

const paiAlunoCRUDSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome do aluno é obrigatório!"],
    maxlength: [40, "O nome deve ter no máximo 40 caracteres"]
  },
  cpf: {
    type: String,
    required: [true, "O CPF é obrigatório!"],
    maxlength: [11, "O CPF deve ter no máximo 11 caracteres"]
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
  }
});

export const PaiAlunoCRUDModel = mongoose.model<IPaiAlunoModel>(
  PAI_ALUNO_MODEL_NAME,
  paiAlunoCRUDSchema,
  PAI_ALUNO_MODEL_NAME
);
