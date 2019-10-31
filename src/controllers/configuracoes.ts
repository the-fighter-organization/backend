import * as express from 'express';
import * as passport from 'passport';

import ConfiguracaoService from '../services/ConfiguracaoService';

const router = express.Router();
const service = new ConfiguracaoService();

const secureRoute = passport.authenticate('bearer', { session: false })

export default class ConfiguracaoController {
  static config() {
    router.post("/", secureRoute, service.save);
    router.get("/", secureRoute, service.findOne);
    return router;
  }
}

