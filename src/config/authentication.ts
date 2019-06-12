import { Strategy } from "passport-http-bearer";
import * as passport from "passport";
import { UserCRUDModel, IUserLoginModel } from "../model/usuarios/Usuario";
import * as jwt from "jsonwebtoken";
import {secret} from './authentication.config.json'

export default class AuthConfig {
  static config() {
    passport.use(
      new Strategy(async (token, cb) => {
        try {
        let decoded = jwt.verify(token, secret) as IUserLoginModel

        if(!decoded){
          return cb(null, false);
        }
        
        let user = await UserCRUDModel
          .findOne({ email: decoded.email } as IUserLoginModel);

        if (user) {
          let {senha, ...response} = user
          return cb(null, response);
        }

        return cb(null, false);
        } catch (error) {
          console.log(error)
          return cb(null, false);
        }
      })
    );
  }
}
