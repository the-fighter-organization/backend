import * as mongoose from 'mongoose'

export namespace Alunos.Types {
    export type Nacionalidade = "Afeganistão" | "Andorra" | "Angola" | "Antígua e Barbuda" | "Argélia" | "Argentina" | "Armênia" | "Austrália" | "Áustria" | "Azerbaijão" | "Bahamas" | "Bangladesh" | "Barbados" | "Barém" | "Bielorrússia" | "Bélgica" | "Belize" | "Benim" | "Bolívia" | "Bósnia; Bósnia e Herzegovina" | "Botsuana" | "Brasil" | "Brunei" | "Bulgária" | "BurkinaFaso" | "Burundi" | "Butão" | "Cabo Verde" | "Camarões" | "Camboja" | "Canadá" | "Africana" | "Chade" | "China" | "Chile" | "Ilhas Cook" | "Colômbia" | "Comores" | "Costa Rica" | "Croácia" | "Cuba" | "Chipre" | "República Tcheca" | "República Democrática do Congo" | "Dinamarca" | "Djibuti" | "Dominica" | "República Dominicana" | "Timor Leste" | "Equador" | "Egito" | "ElSalvador" | "Inglaterra" | "Guiné Equatorial" | "Eritreia" | "Estônia" | "Fiji" | "Finlândia" | "França" | "Gabão" | "Gâmbia" | "Geórgia" | "Alemanha" | "Granada" | "Grécia" | "Guatemala" | "Guiné" | "Bissau – GuinéBissau" | "Guiana" | "Haiti" | "Holanda" | "Honduras" | "Hungria" | "Islândia" | "Índia" | "Indonésia" | "Irã" | "Irlanda" | "Israel" | "Itália" | "Costa do Marfim" | "Jamaica" | "Japão" | "Jordânia" | "Cazaquistão" | "Quênia" | "Quiribati" | "Quirguistão" | "Kuwait" | "Laos" | "Letônia" | "Líbano" | "Lesoto" | "Libéria" | "Liechtenstein" | "Lituânia" | "Luxemburgo" | "Líbia" | "Macedônia" | "Madagascar" | "Malásia" | "Malaui" | "Maldivas" | "Máli" | "Malta" | "Maurício" | "Mauritânia" | "Ilhas Marshall" | "Estados Federados da Micronésia" | "México" | "Marrocos" | "Moldavia" | "Mônaco" | "Mongólia" | "Montenegro" | "Moçambique" | "Myanmar" | "Namíbia" | "Nauru" | "Nepal" | "NovaZelândia" | "Nicarágua" | "Níger" | "Nigéria" | "Niue" | "Coréia do Norte" | "Noruega" | "Omã" | "Palestina" | "Paquistão" | "Palau" | "Panamá" | "Papua Nova Guiné" | "Paraguai" | "Peru" | "Philippines" | "Polônia" | "Portugal" | "Catar" | "Romênia" | "Rússia" | "Ruanda" | "Samoa" | "SantaLucia" | "São Cristóvão e Nevis" | "São Marino" | "São Tomé e Príncipe" | "São Vicente e Granadinas" | "Escócia" | "Senegal" | "Sérvia" | "Seicheles" | "Serra Leoa" | "Singapura" | "Eslováquia" | "Ilhas Salomão" | "Somália" | "África do Sul" | "Coréia do Sul" | "Sudão do Sul" | "Espanha" | "Sri Lanka" | "Sudão" | "Suriname" | "Suazilândia" | "Suécia" | "Suíça" | "Síria" | "Tadiquistão" | "Tanzânia" | "Tailândia" | "Togo" | "Tonga" | "TrindadeeTobago" | "Tunísia" | "Turcomenistão" | "Turquia" | "Tuvalu" | "Ucrânia" | "Uganda" | "Uruguai" | "Emirados Árabes Unidos" | "Reino Unido" | "Estados Unidos" | "Usbequistão" | "Vanuatu" | "Venezuela" | "Vietnã" | "País de Gales" | "Iêmen" | "Zâmbia" | "Zimbábue"

    export interface IAlunoMensalidade extends mongoose.Document {
        situacao: 'Aberta' | 'Fechada';
        formasPagamento: IAlunoMensalidadeFormaPagamento[];
        observacoes: string;
        data: Date
    }

    export interface IAlunoMensalidadeFormaPagamento {
        descricao?: string;
        formaPagamento: 'Dinheiro' | 'Cartão de crédito' | 'Cartão de débito' | 'Cheque' | 'Transferência eletrônica';
        valor: number;
    }

    export interface IEndereco {
        logradouro: string;
        numero: string;
        bairro: string;
        cidade: string;
        cep: string;
        uf: string;
    }

    export interface IResponsavel {
        nome: string;
        cpf: string;
        rg: string;
        telefone: string;
        nivelParentesco: NivelParentesco;
        observacao: string;
    }

    export enum NivelParentesco {
        PAI,
        MAE,
        IRMAO,
        OUTRO_FAMILIAR,
        APENAS_RESPONSAVEL
    }

    export enum Sexo {
        MASCULINO,
        FEMININO
    }

    export enum PeriodoEnsino {
        MATUTINO,
        VESPERTINO,
        NOTURNO
    }

    export enum SituacaoCBJ {
        REGULAR,
        PENDENTE,
        IRREGULAR
    }

    export interface IAlunoModel extends mongoose.Document {
        // Dados do aluno
        nome: string;
        dataNascimento: Date;
        cpf: string;
        rg: string;
        orgaoEmissor: string;
        dataExpedicao: string;
        sexo: Alunos.Types.Sexo;
        nacionalidade: Alunos.Types.Nacionalidade;
        naturalidade: Alunos.Types.Nacionalidade;
        bolsista: boolean;
        numeroZempo: string;
        numeroFiliacao: string;
        // Filiação e responsáveis
        responsaveis: [Alunos.Types.IResponsavel];
        // Endereço  
        endereco: [Alunos.Types.IEndereco],
        // Contato
        telefone: string;
        email: string;
        // Escolaridade
        instituicaoEnsino: string;
        periodo: Alunos.Types.PeriodoEnsino;
        ano: string;
        // Demais Informações
        graduacaoAtual: string;
        pesoAtual: number;
        alturaAtual: number;
        dataUltimaGraduacao: Date;
        categoria: string;
        tipoSanguineo: string;
        dataFiliacao: Date;
        situacaoFejur: string;
        situacaoFbj: string;
        observacoesMedicas: string;
        // Mensalidades
        mensalidades: Alunos.Types.IAlunoMensalidade[];
        // Administrativo
        ultimaAtivacao: Date;
        inativo: boolean;
        usuario: mongoose.Schema.Types.ObjectId
    }
}