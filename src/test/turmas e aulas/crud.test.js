import { expect } from 'chai';
import request from 'request';

import { TEST_BASE_URL } from '../constants';

const CONTROLLER = "turmas";
let token = null;
let idTurma = null;

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

describe("CRUD de turma", () => {
  let objTeste = {
    "inativo": false,
    "aulas": [],
    "colaboradores": ["Igor", "Thiago"],
    "nome": "Igor Matheus Coleto Bueno",
    "arteMarcial": "Judô", "localTreino": "Aqui",
    "alunos": []
  }


  describe("#Inserindo", () => {
    it("Inserindo o turma", done => {
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
          expect(httpResponse.statusCode, "Inseriu o turma?").to.equal(200)
          done()

          idTurma = JSON.parse(body)._id
        })
    })
  })

  describe("#Alterando", () => {
    it("Alterando o turma", done => {
      request.post(
        {
          url: `${TEST_BASE_URL}/${CONTROLLER}`,
          form: { ...objTeste, _id: idTurma },
          auth: {
            bearer: token
          }
        }, function (err, httpResponse, body) {
          if (err) {
            done(err)
          }
          expect(httpResponse.statusCode, "Alterou o turma?").to.equal(200)
          done()
        })
    })
  })

  describe("#Listando", () => {
    it("Gerando listagem de turma", done => {

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
    it("Removendo o turma", done => {
      request.delete(
        {
          url: `${TEST_BASE_URL}/${CONTROLLER}/${idTurma}`,
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

