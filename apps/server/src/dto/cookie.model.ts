import {t} from 'elysia'
import { SECRET_KEY } from '../constants'
export const cookie = t.Cookie({
    sessionToken:t.Optional(t.String())
},{sign:['sessionToken'],secrets:SECRET_KEY, httpOnly:true})
