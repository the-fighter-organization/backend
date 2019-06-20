import UsuarioController from '../controllers/usuarios';
import * as express from 'express';
import AlunoController from '../controllers/alunos';

export default class ConfigConfig{
    public static config(app:express.Express){
        app.use('/usuarios', UsuarioController.config())
        app.use('/alunos', AlunoController.config())
    }
}