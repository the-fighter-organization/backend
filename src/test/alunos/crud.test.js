import { expect } from 'chai';
import request from 'request';

import { TEST_BASE_URL } from '../constants';

const CONTROLLER = "alunos";
let token = null;
let idAluno = null;

describe("#Login", () => {
  it("Fazendo login de usuário (Login correto)", done => {
    let objLogin = { email: "teste@teste.com", senha: "123" };

    request.post(
      {
        url: `${TEST_BASE_URL}/usuarios/authenticate`,
        form: objLogin
      }, function (err, httpResponse, body) {
        if (err) {
          done(err)
        }

        expect(httpResponse.statusCode, "Login deu certo?").to.equal(200)
        token = JSON.parse(body).token
        done()
      })
  })
})

describe("CRUD de aluno", () => {
  let objTeste = {
    "inativo": false,
    "nacionalidade": "Brasil",
    "naturalidade": "Brasil",
    "nome": "Igor Matheus Coleto Bueno",
    "telefone": "69981328015",
    "dataNascimento": "1999-08-20",
    "cpf": "03136442202",
    "rg": "0298036",
    "dataExpedicao": "2014-06-17",
    "sexo": "0",
    "periodo": "0",
    "responsaveis": [
      { "nome": "Eclésio Ferreira de Melo Junior", "cpf": "00000000000", "rg": "0000000", "nivelParentesco": "4", "telefone": "69981328015" }
    ],
    "endereco": {
      "logradouro": "São Luiz", "numero": "5662", "cidade": "Vilhena", "cep": "76988009", "uf": "RO", "bairro": "Bairro de teste"
    },
    "numeroZempo": "123",
    "numeroFiliacao": "12332",
    "graduacaoAtual": "GADO",
    "pesoAtual": 85,
    "alturaAtual": 1.85,
    "dataUltimaGraduacao": "2019-06-11",
    "categoria": "GADO",
    "dataFiliacao": "2019-11-04",
    "situacaoFejur": "Ok",
    "situacaoFbj": "OK",
    "tipoSanguineo": "A+",
    "observacoesMedicas": "Ok",
    "mensalidades": [{ "data": "2019-11-05", "situacao": "Fechada", "formasPagamento": [{ "descricao": "Ok", "formaPagamento": "Dinheiro", "valor": 60 }] }]
  };


  describe("#Inserindo", () => {
    it("Inserindo o aluno", done => {
      request.post(
        {
          url: `${TEST_BASE_URL}/${CONTROLLER}`,
          form: objTeste,
          auth: {
            bearer: token
          }
        }, function (err, httpResponse, body) {
          if (err) {
            done(err)
          }
          expect(httpResponse.statusCode, "Inseriu o aluno?").to.equal(200)
          done()

          idAluno = JSON.parse(body)._id
        })
    })
  })

  describe("#Alterando", () => {
    it("Alterando o aluno", done => {
      request.post(
        {
          url: `${TEST_BASE_URL}/${CONTROLLER}`,
          form: { ...objTeste, _id: idAluno },
          auth: {
            bearer: token
          }
        }, function (err, httpResponse, body) {
          if (err) {
            done(err)
          }
          expect(httpResponse.statusCode, "Alterou o aluno?").to.equal(200)
          done()
        })
    })
  })

  describe("#Listando", () => {
    it("Gerando listagem de aluno", done => {

      request.get(
        {
          url: `${TEST_BASE_URL}/${CONTROLLER}`,
          auth: {
            bearer: token
          }
        }, function (err, httpResponse, body) {
          if (err) {
            done(err)
          }

          expect(httpResponse.statusCode, "Listou corretamente?").to.equal(200)
          done()
          let lista = JSON.parse(body);

          console.log(lista.map(item => item.nome).join(","))
        })
    })
  })

  describe("#Removendo", () => {
    it("Removendo o aluno", done => {
      request.delete(
        {
          url: `${TEST_BASE_URL}/${CONTROLLER}/${idAluno}`,
          auth: {
            bearer: token
          }
        }, function (err, httpResponse, body) {
          if (err) {
            done(err)
          }

          expect(httpResponse.statusCode, "Removeu corretamente?").to.equal(200)
          done()
        })
    })
  })
})

