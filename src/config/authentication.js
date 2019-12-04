import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportHttpBearer from 'passport-http-bearer';

import { UserCRUDModel } from '../model/usuarios/Usuario';

export default class AuthConfig {
  static config() {
    passport.use(
      new passportHttpBearer.Strategy(async (token, cb) => {
        try {
          let decoded = jwt.verify(token, process.env.SECRET)

          if (!decoded) {
            return cb(null, false);
          }

          let user = await UserCRUDModel
            .findOne({ email: decoded.email });

          if (user) {
            let { senha, ...response } = user
            return cb(null, response);
          }

          return cb(null, false);
        } catch (error) {
          return cb(null, false);
        }
      })
    );
  }
}
