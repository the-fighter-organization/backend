import * as express from "express";
import * as passport from 'passport'
import AlunoService from "../services/AlunoService";

const router = express.Router();
const service = new AlunoService();

const secureRoute = passport.authenticate('bearer', { session: false })

router.use((req,res,next) => {
  console.log(req.user)
  next()
})

export default class AlunoController {
  static config() {
    router.post("/",secureRoute, service.save);
    router.get("/", secureRoute, service.findAll);
    router.get("/:id", secureRoute, service.findOne);
    router.delete("/:id", secureRoute, service.remove);
     
    // this.defineMiddlewares()
    return router;
  }

  // static defineMiddlewares(){
  //   router.use((req, res, next) => {
  //     console.log(req.user)
  //     next()
  //   })
  // }
}
  
