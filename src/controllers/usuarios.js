import express from "express";
import UsuarioService from "../services/UsuarioService";
import passport from 'passport'

const router = express.Router();
const service = new UsuarioService();

const secureRoute = passport.authenticate('bearer', { session: false });

export default class UsuarioController {
  static config() {
    router.post("/novo", service.novo);
    router.post("/editar-perfil", secureRoute, service.editarPerfil);
    router.post("/editar-senha", service.editarSenha);
    router.get("/confirmar-perfil/:id/:codigoConfirmacao", service.confirmarPerfil);
    router.post("/authenticate", service.authenticate);
    router.get("/current-user", secureRoute, service.findOne);
    router.delete("/current-user", secureRoute, service.remove);

    return router;
  }
}
