import express from "express";
import passport from 'passport'
import TurmaService from '../services/TurmaService';

const router = express.Router();
const service = new TurmaService();

const secureRoute = passport.authenticate('bearer', { session: false })

export default class TurmaController {
  static config() {
    router.post("/", secureRoute, service.save);
    router.post("/buscar", secureRoute, service.find);
    router.get("/", secureRoute, service.findAll);
    router.get("/:id", secureRoute, service.findOne);
    router.delete("/:id", secureRoute, service.remove);
    return router;
  }
}

