import UserService from '../../services/user.service';
import ClientService from '../../services/client.service';
import JwtService from '../../services/jwt.service';
import { Request, Response } from 'express';
import L from '../../../common/logger';

export class Controller {
  async validate(req: Request, res: Response): Promise<void> {
    L.debug('auth header: ' + req.headers.authorization);
    L.debug('auth cookie: ' + req.cookies.auth);
    try {
      let header = req.headers.authorization;
      if (header == null) { header = "Cookie " + req.cookies.auth; }
      const borne = header.split(/ /)[1];
      const token = JwtService.decode(borne);
      L.debug('token: ' + JSON.stringify(token, null, 2));
      if ((await UserService.validSession(token.userId)) == true ||
          (await ClientService.authorizedClient(token)) == true) {
        L.debug('ok');
        res.status(200).send({});
      } else {
        L.debug('unauthorized');
        res.status(401).send({});
      }
    } catch (error) {
      L.debug('error: ' + JSON.stringify(error, null, 2));
      res.status(401).send({});
    };
  }
}
export default new Controller();
