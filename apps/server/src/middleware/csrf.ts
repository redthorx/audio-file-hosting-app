import { Elysia,t} from 'elysia'

export const xsrfGuard = new Elysia()
                                .guard({
                                    as:'scoped',
                                    headers:t.Object({
                                        'x-csrf':t.String({
                                            minLength:1,
                                            error(){
                                                return 'csrf header missing'
                                            }
                                        })
                                    })
                                })