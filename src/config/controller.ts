import UsuarioController from '../controllers/Usuarios';
import * as express from 'express';

export default class ConfigConfig{
    public static config(app:express.Express){
        app.use('/usuarios', UsuarioController.config())
        app.use('/teste', (req, res) => {res.send({message:"Deu certo"})})
    }
}