import * as request from 'request'
import { expect } from 'chai';
import { TEST_BASE_URL } from '../constants';
import { IUserModel } from '../../model/usuarios/Usuario';

const CONTROLLER = "usuarios";
let token = null;
let idUsuario = null;

describe("CRUD de usuário", () => {
    let objTeste = {
        nome: "Teste",
        email: "email@email.com",
        senha: "senha"
    } as IUserModel;


    describe("#Inserindo", () => {
        it("Inserindo o usuário", done => {
            request.post(
                {
                    url: `${TEST_BASE_URL}/${CONTROLLER}`,
                    form: objTeste
                }, function (err, httpResponse, body) {
                    if (err) {
                        done(err)
                    }
                    expect(httpResponse.statusCode, "Inseriu o usuário?").to.equal(200)
                    done()

                    idUsuario = JSON.parse(body)._id
                })
        })
    })

    describe("#Login", () => {
        it("Fazendo login de usuário (Login correto)", done => {
            let objLogin = {email : objTeste.email, senha : objTeste.senha};

            request.post(
                {
                    url: `${TEST_BASE_URL}/${CONTROLLER}/authenticate`,
                    form: objLogin
                }, function (err, httpResponse, body) {
                    if (err) {
                        done(err)
                    }

                    expect(httpResponse.statusCode, "Login deu certo?").to.equal(200)
                    token = JSON.parse(body).token
                    done()
                    console.log(token)
                })
        })
        it("Fazendo login de usuário (Login errado)", done => {
            let objLogin = {email : objTeste.email, senha : "Uma senha errada qualquer"};

            request.post(
                {
                    url: `${TEST_BASE_URL}/${CONTROLLER}/authenticate`,
                    form: objLogin
                }, function (err, httpResponse, body) {
                    if (err) {
                        done(err)
                    }

                    expect(httpResponse.statusCode, "Login deu certo?").to.equal(200)
                    token = JSON.parse(body).token
                    done()
                    console.log(token)
                })
        })
    })

    
    describe("#Alterando", () => {
        it("Alterando o usuário", done => {
            request.post(
                {
                    url: `${TEST_BASE_URL}/${CONTROLLER}`,
                    form: {...objTeste, _id : idUsuario},
                    auth:{
                        bearer: token
                    }
                }, function (err, httpResponse, body) {
                    if (err) {
                        done(err)
                    }
                    expect(httpResponse.statusCode, "Alterou o usuário?").to.equal(200)
                    done()
                })
        })
    })

    describe("#Listando", () => {
        it("Gerando listagem de usuário", done => {

            request.get(
                {
                    url: `${TEST_BASE_URL}/${CONTROLLER}`,
                    auth:{
                        bearer: token
                    }
                }, function (err, httpResponse, body) {
                    if (err) {
                        done(err)
                    }

                    expect(httpResponse.statusCode, "Listou corretamente?").to.equal(200)
                    done()
                    let lista = JSON.parse(body) as IUserModel[];
                    
                    console.log(lista.map(item => item.nome).join(","))
                })
        })
    })

    describe("#Removendo", () => {
        it("Removendo o usuário", done => {
            request.delete(
                {
                    url: `${TEST_BASE_URL}/${CONTROLLER}/${idUsuario}`,
                    auth:{
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

