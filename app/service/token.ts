import { Service } from "egg";
import { ISignInUser } from '../controller/api/sign';

export default class TokenService extends Service {
    async apply(user: ISignInUser) {
        const { ctx, service } = this;
        return ctx.app.jwt.sign(user, ctx.app.config.jwt.secret, { expiresIn: '1h' });
    }

}