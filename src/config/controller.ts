import UsuarioController from '../controllers/usuarios';
import * as express from 'express';
import AlunoController from '../controllers/alunos';
import HomeController from '../controllers/home';
import { serve, setup } from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'

export default class ConfigConfig {
    public static config(app: express.Express) {
        app.use('/', HomeController.config())
        app.use('/api-docs', serve, setup(swaggerDocument))
        app.use('/usuarios', UsuarioController.config())
        app.use('/alunos', AlunoController.config())
    }
}