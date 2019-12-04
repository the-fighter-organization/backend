import express from "express";

const router = express.Router();

export default class HomeController {
  static config() {
    router.get("/", (req, res) => {
      res.send("Olá, você está na API do Warrior!")
    });

    return router;
  }
}
