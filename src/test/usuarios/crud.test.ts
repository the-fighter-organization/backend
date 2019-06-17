// import * as should from 'should';
import * as request from 'request'
import { expect } from 'chai';
import { TEST_BASE_URL } from '../constants';
import { IUserModel, UserCRUDModel } from '../../model/usuarios/Usuario';

const CONTROLLER = "usuarios";

describe("CRUD de usuário", () => {
    let objTeste = {
        nome: "Teste",
        email: "email@email.com",
        senha: "senha"
    } as IUserModel;


    describe("#Salvando", () => {
        it("Salvando e removendo usuário em seguida", () => {
            return new Promise((resolve, reject) => {
                request.post(
                    {
                        url: `${TEST_BASE_URL}/${CONTROLLER}`,
                        form: objTeste
                    }, function (err, httpResponse, body) {
                        if (err) {
                            reject(err);
                        }
                        expect(httpResponse.statusCode, "Status de sucesso do salvamento").to.equal(200)
                        return UserCRUDModel
                            .findOneAndRemove({ email: objTeste.email }, r => { console.log("Ok") })
                            .then(r => console.log("Ok"))
                    })
            })
        })
    })
})

