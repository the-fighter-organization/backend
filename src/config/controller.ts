import UsuarioController from '../controllers/usuarios';
import * as express from 'express';
import AlunoController from '../controllers/alunos';
import HomeController from '../controllers/home';

export default class ConfigConfig{
    public static config(app:express.Express){
        app.use('/', HomeController.config())
        app.use('/usuarios', UsuarioController.config())
        app.use('/alunos', AlunoController.config())
    }
}