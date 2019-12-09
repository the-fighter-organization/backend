import express from 'express';
import passport from 'passport';

import ConfiguracaoService from '../services/ConfiguracaoService';

const router = express.Router();
const service = new ConfiguracaoService();

const secureRoute = passport.authenticate('bearer', { session: false })

export default class ConfiguracaoController {
  static config() {
    router.get("/", secureRoute, service.findOne);
    router.post("/", secureRoute, service.save);
    return router;
  }
}

