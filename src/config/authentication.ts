import { Strategy } from "passport-http-bearer";
import * as passport from "passport";
import { UserCRUDModel } from "../model/usuarios/Usuario";

export default class AuthConfig {
  static config() {
    passport.use(
      new Strategy(async (token, cb) => {
        let user = await UserCRUDModel.findOne({ token });

        if (user) {
          return cb(null, user);
        }

        return cb(null, false);
      })
    );
  }
}
