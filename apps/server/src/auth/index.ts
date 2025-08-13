import { Elysia,t } from 'elysia'
import { xsrfGuard } from '../middleware/csrf'
import { Error } from '../dto/error.model';
import { createUser, getUser, validateUser } from './controller';
import { isUniqueConstraintError } from '../errors';
import{logger} from '@bogeychan/elysia-logger'
import { cookie } from '../dto/cookie.model';
import { cookieConfig } from '../cookie.config';
import { session, setSessionToken } from '../middleware/session';
import { User } from '../dto/userAuth.model';
//use this to check and set cookie
export const auth = new Elysia({prefix:'/auth',cookie:cookieConfig,aot:false})
                                .use(logger())
                                .use(xsrfGuard)
					            .post('/register', async function registerUser({body:{username,password},log,status}){
                                   try{
                                    await createUser(username,password)
                                    return {success:true}
                                   }catch(error:any){
                                        if(isUniqueConstraintError(error)){
                                            return status(409,{error: "user already exists"})
                                        }
                                        log.error(error?.message)
                                        return status(500,{error:"Internal server error"})
                                   }
                                },{
                                    body:User,
                                    response:{
                                        200:t.Object({success:t.Boolean({description:'If the action was successful'})}),
                                        409:Error,
                                        500:Error
                                    },
                                    detail:{
                                        summary:"Register a user",
                                        tags:['Auth'],
                                        description:'This API can be accessed without logging in. Used to register a user into the App'
                                    }
                                })
                                .post('/login', async function loginUser({body:{username,password},log,cookie,status}){
                                    try{
                                        const{sessionToken} = cookie
                                        const user = await validateUser(username,password)
                                        if(user){
                                            setSessionToken(user.username,sessionToken)
                                            return {success:true,username:user.username}
                                        }
                                        return status(401,{error:'invalid credentials'})

                                        
                                    }catch(error:any){
                                        log.error('error logging in user',error.message)
                                        console.log(error.message)
                                        return status(500,{error:'Internal server error'})
                                    }
                                },{
                                    body:User,
                                    response:{
                                        200:t.Object({
                                            success:t.Boolean({description:'if the login was successful'}),
                                            username:t.String({description:'The username of the user'})
                                        }),
                                        401:Error,
                                        500:Error,
                                        400:Error

                                    },
                                    detail:{
                                        summary:"Login a user",
                                        tags:['Auth'],
                                        description:'This Endpoint logs in an user and sets session authentication tokens through cookies'
                                       
                                    },
                                    cookie:cookie
                                })
                                .get('/session', async function getUserSession({log,cookie,status}){
                                    const {sessionToken} = cookie;
                                    const userSession = session(sessionToken)
                                    if(userSession.user){
                                        const user = await getUser(userSession.user)
                                        if(user){
                                            setSessionToken(userSession.user,sessionToken)
                                            return{
                                                username:userSession.user,
                                                isAdmin:user.isAdmin
                                            }
                                        }
                                    }
                                    return {username:null}
                                },{
                                    cookie:cookie,
                                    response:{
                                        200:t.Object({
                                            username:t.Union([t.String({description:'The username of the user'}),t.Null({description:'Null if it doesnt exist'})]),
                                            isAdmin:t.Optional(t.Boolean({description:'If the user is an Admin'}))
                                        }),
                                        400:Error
                                    },
                                    detail:{
                                        summary:"Get User session",
                                        tags:['Auth'],
                                        description:'Endpoint to query session state, and if a user is an Admin'

                                    }
                                })
                                .post('/logout', function logoutUserSession({cookie}){
                                    const {sessionToken} = cookie;
                                    setSessionToken(null,sessionToken);
                                    return{'success':true}

                                },{
                                    response:{
                                        200:t.Object({
                                            success:t.Boolean()
                                        })
                                    },
                                    cookie:cookie,
                                    detail:{
                                        summary:"Logout a user",
                                        tags:['Auth'],
                                        description:'This API Endpoint clears the session for the user by unsetting cookies'

                                    }
                                })
