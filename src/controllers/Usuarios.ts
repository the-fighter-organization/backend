import * as express from "express";
import UsuarioService from "../services/UsuarioService";
import * as passport from 'passport'

const router = express.Router();
const service = new UsuarioService();

const secureRoute =  passport.authenticate('bearer', { session: false });

export default class UsuarioController {
  static config() {
    router.post("/", service.save);
    router.post("/authenticate", service.authenticate);
    router.get("/",secureRoute,service.findAll);
    router.get("/:id",secureRoute,service.findOne);
    router.delete("/:id", secureRoute, service.remove);

    return router;
  }
}
