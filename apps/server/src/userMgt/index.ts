import {Elysia, t} from 'elysia'
import { cookieConfig } from '../cookie.config'
import { logger } from '@bogeychan/elysia-logger'
import { User } from '../dto/userAuth.model'
import { cookie } from '../dto/cookie.model'
import { deleteUser, getUsers, isAdmin, updateUser } from './controller'
import { session } from '../middleware/session'
import { Error } from '../dto/error.model'
import { createUser } from '../auth/controller'
import { isUniqueConstraintError } from '../errors'
import { xsrfGuard } from '../middleware/csrf'

export const manage = new Elysia({prefix:'/manage',cookie:cookieConfig,aot:false})
                                .use(logger())
                                .use(xsrfGuard)
                                .get('/user', async function admingetUsers({query:{username},cookie,log,status}){
                                    const {sessionToken} = cookie;
                                    const userSession = session(sessionToken)
                                    if(userSession.user){
                                        try{ 
                                            const isUserAdmin = await isAdmin(userSession.user)
                                            if(!isUserAdmin) return status(401,{error:'Unauthorized'})
                                            const users = await getUsers(username)
                                            if(users.length<1){
                                                return status(404,{error:'not found'})
                                            }
                                            return users;
                                        }
                                        catch(error:any){
                                            log.error(error?.message)
                                            return status(500,{error:"Internal server error"})
                                        }
                                    }
                                    return status(401,{error:'Unauthorized'})
                                },{ 
                                    response:{
                                        200:t.Array(t.Object({
                                            username:t.String({description:'The username of the user'}),
                                            id:t.Number({description:'The user ID of the user'}),
                                            isAdmin:t.Boolean({description:'If the user is an Admin'})
                                        })),
                                        401:Error,
                                        500:Error,
                                        404:Error
                                    },
                                    query:t.Optional(t.Omit(User,['password'])),
                                    cookie:cookie,
                                    detail:{
                                        summary:'Get current users',
                                        tags:['User Management'],
                                        description:'Gets a list of current users',

                                    }
                                })
                                .post('/user', async function adminCreateUser({body:{username,password},cookie,log,status}){
                                    const {sessionToken} = cookie;
                                    const userSession = session(sessionToken)
                                    if(userSession.user){
                                        try{ 
                                            const isUserAdmin = await isAdmin(userSession.user)
                                            if(!isUserAdmin) return status(401,{error:'Unauthorized'})
                                            await createUser(username,password)
                                            return {success:true}
                                        }
                                        catch(error:any){
                                            if(isUniqueConstraintError(error)){
                                                return status(409,{error: "user already exists"})
                                            }
                                            log.error(error?.message)
                                            return status(500,{error:"Internal server error"})
                                        }
                                        
                                    }
                                        return status(401,{error:'Unauthorized'})
                                    },{
                                        body:User,
                                        response:{
                                            200:t.Object({
                                                success:t.Boolean({description:'If the user was created'})
                                            }),
                                            401:Error,
                                            409:Error,
                                            500:Error
                                        },
                                        cookie:cookie,
                                        detail:{
                                            summary:'Create a user as an Admin',
                                            tags:['User Management'],
                                            description:'Creates a user as an Admin. This endpoint can only be used by Admins',
                                    }
                                    }
                                )
                                /**
                                 * assumption that admin can change passwords 
                                 */
                                .patch('/user',async function adminUpdateUser({body:{username,password,setAdmin},cookie,log,status}){
                                    const {sessionToken} = cookie;
                                    const userSession = session(sessionToken)
                                    if(userSession.user){
                                        try{
                                            const isUserAdmin = await isAdmin(userSession.user)
                                            if(!isUserAdmin) return status(401,{error:'Unauthorized'})
                                            if(!password && setAdmin === undefined) return status(400,{error:'nothing to update'})
                                            const isUpdated = await updateUser(username,password,setAdmin)
                                            if(isUpdated === 404){
                                                return status(404, {error:'User not found'})
                                            }
                                            return {success:true}
                                        }
                                        catch(error:any){
                                            log.error(error.message)
                                            return status(500,{error:"Internal server error"})

                                        }

                                    }
                                    return status(401,{error:'Unauthorized'})
                                },{
                                    body:t.Object({
                                        username:t.String({description:'The username of the user'}),
                                        password:t.Optional(t.String({description:'The new password of the user'})),
                                        setAdmin:t.Optional(t.Boolean({description:'To set if the user is now an Admin or not'}))
                                    }),
                                    response:{
                                        200:t.Object({
                                                success:t.Boolean()
                                            }),
                                        401:Error,
                                        400:Error,
                                        404:Error,
                                        500:Error
                                    },
                                    cookie:cookie,
                                    detail:{
                                        summary:'Update User Detail',
                                        tags:['User Management'],
                                        description:'Update either the password or set the user as an Admin.',

                                    }
                                })
                                .delete('/user',async function adminDeleteUser({body:{username},cookie,log,status}){
                                    const {sessionToken} = cookie;
                                    const userSession = session(sessionToken)
                                    if(userSession.user){
                                        try{
                                        const isUserAdmin = await isAdmin(userSession.user)
                                        if(!isUserAdmin) return status(401,{error:'Unauthorized'})
                                        const exists = await deleteUser(username)
                                        if(!exists) return status(404,{error:'Not found'})
                                        return {success:true}
                                        }
                                        catch(error:any){
                                            log.error(error.message)
                                            return status(500,{error:"Internal server error"})
                                        }

                                    }
                                    return status(401,{error:'Unauthorized'})
                                },{
                                    body:t.Object({
                                        username:t.String({description:'The username of the User'})
                                    }),
                                    response:{
                                        200:t.Object({
                                            success:t.Boolean({description:'If the deletion was successful'})
                                        }),
                                        401:Error,
                                        404:Error,
                                        500:Error,
                                    },
                                    cookie:cookie,
                                    detail:{
                                        summary:'Delete a user',
                                        tags:['User Management'],
                                        description:'Delete a current user. Note: This does not delete the Audio files uploaded by the user'

                                    }
                                })
