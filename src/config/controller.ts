import UsuarioController from '../controllers/Usuarios';
import * as express from 'express';
import AlunoController from '../controllers/Alunos';

export default class ConfigConfig{
    public static config(app:express.Express){
        app.use('/usuarios', UsuarioController.config())
        app.use('/alunos', AlunoController.config())
    }
}