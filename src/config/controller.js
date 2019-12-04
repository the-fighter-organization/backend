import swagger from 'swagger-ui-express';

import AlunoController from '../controllers/alunos';
import AulaController from '../controllers/aulas';
import HomeController from '../controllers/home';
import TurmaController from '../controllers/turma';
import UsuarioController from '../controllers/usuarios';
import * as swaggerDocument from './swagger.json';
import ConfiguracaoController from '../controllers/configuracoes';

export default class ConfigConfig {
    static config(app) {
        app.use('/', HomeController.config())
        app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument))
        app.use('/usuarios', UsuarioController.config())
        app.use('/alunos', AlunoController.config())
        app.use('/configuracoes', ConfiguracaoController.config())
        app.use('/turmas', TurmaController.config())
        app.use('/aulas', AulaController.config())
    }
}