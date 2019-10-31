import * as express from 'express';
import { serve, setup } from 'swagger-ui-express';

import AlunoController from '../controllers/alunos';
import AulaController from '../controllers/aulas';
import HomeController from '../controllers/home';
import TurmaController from '../controllers/turma';
import UsuarioController from '../controllers/usuarios';
import * as swaggerDocument from './swagger.json';
import ConfiguracaoController from '../controllers/configuracoes';

export default class ConfigConfig {
    public static config(app: express.Express) {
        app.use('/', HomeController.config())
        app.use('/api-docs', serve, setup(swaggerDocument))
        app.use('/usuarios', UsuarioController.config())
        app.use('/alunos', AlunoController.config())
        app.use('/configuracoes', ConfiguracaoController.config())
        app.use('/turmas', TurmaController.config())
        app.use('/aulas', AulaController.config())
    }
}