import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as morgan from 'morgan';

import DatabaseConfig from './config/database';
import ControllerConfig from './config/controller';
import AuthConfig from './config/authentication';

const app = express();

// middlewares do express
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('combined'));


// Configurações de rotas
ControllerConfig.config(app);

// Configurações do db
DatabaseConfig.config()
require('mongoose').Promise = global.Promise

// Configurações de autenticação
AuthConfig.config();

// Iniciando o servidor
app.listen(3001, () => console.log("Servidor iniciado na porta 3001"))
