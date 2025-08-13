import { SESSION_COOKIE_EXPIRES,SECRET_KEY } from "./constants"
import { CookieOptions } from "elysia"
export const cookieConfig : CookieOptions & {
    sign?: true | string | string[];
}={
    expires: new Date(Date.now()+SESSION_COOKIE_EXPIRES),
    httpOnly:true,
    secrets:SECRET_KEY,
    sign:['username','exp']
}