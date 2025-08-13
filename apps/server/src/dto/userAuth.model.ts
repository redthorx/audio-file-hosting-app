import {t} from 'elysia'
export const User = t.Object({
    username:t.String({minLength:1}),
    password:t.String({minLength:1})
})