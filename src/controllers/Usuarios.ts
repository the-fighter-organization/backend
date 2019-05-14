import * as express from "express";
import UsuarioService from "../services/UsuarioService";
import * as passport from 'passport'

const router = express.Router();
const service = new UsuarioService();

export default class UsuarioController {
  static config() {
    router.post("/", service.save);
    router.post("/authenticate", service.authenticate);
    router.get("/", passport.authenticate('bearer', { session: false }),service.findAll);
    router.get("/:id", passport.authenticate('bearer', { session: false }),service.findOne);
    router.delete("/:id", service.remove);

    return router;
  }
}
