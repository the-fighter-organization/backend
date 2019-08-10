import * as express from "express";

const router = express.Router();

export default class HomeController {
  static config() {
    router.get("/", (req:express.Request, res: express.Response) => {
      res.send("Olá, você está na API do Warrior!")
    });

    return router;
  }
}
