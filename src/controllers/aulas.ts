import * as express from "express";
import * as passport from 'passport'
import AulaService from '../services/AulaService';

const router = express.Router();
const service = new AulaService();

const secureRoute = passport.authenticate('bearer', { session: false })

export default class AulaController {
  static config() {
    router.post("/buscar", secureRoute, service.find);
    router.post("/:turmaId", secureRoute, service.save);
    router.get("/", secureRoute, service.findAll);
    router.get("/:turmaId/:id", secureRoute, service.findOne);
    router.delete("/:turmaId/:id", secureRoute, service.remove);
    return router;
  }
}

