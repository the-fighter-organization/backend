import * as express from "express";
import * as passport from 'passport'
import PaiAlunoService from "../services/PaiAlunoService";

const router = express.Router();
const service = new PaiAlunoService();

const secureRoute = passport.authenticate('bearer', { session: false })

export default class PaiAlunoController {
  static config() {
    router.post("/",secureRoute, service.save);
    router.get("/", secureRoute,service.findAll);
    router.get("/:id", secureRoute,service.findOne);
    router.delete("/:id", secureRoute, service.remove);

    return router;
  }
}
