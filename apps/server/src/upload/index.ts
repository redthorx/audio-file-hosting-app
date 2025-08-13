import {Elysia, t,file} from 'elysia'
import { cookieConfig } from '../cookie.config'
import { logger } from '@bogeychan/elysia-logger'
import { cookie } from '../dto/cookie.model'
import { session } from '../middleware/session'
import { Error } from '../dto/error.model'
import { xsrfGuard } from '../middleware/csrf'
import { getCategory, getUrl, getUserFiles, userUploadFile } from './controller'
import { MAX_FILE_UPLOAD } from '../constants'

export const upload = new Elysia({prefix:'/uploads',cookie:cookieConfig})
                                .use(logger())
                                .use(xsrfGuard)
                                .get('/', async function getUploads({cookie,log,status}){
                                    const {sessionToken} = cookie;
                                    const userSession = session(sessionToken)
                                    if(userSession.user){
                                        try{ 
                                            const files = await getUserFiles(userSession.user)
                                            return {data:files}
                                        }
                                        catch(error:any){
                                            log.error(error?.message)
                                            return status(500,{error:'Error getting files'})
                                        }
                                    }
                                    return status(401,{error:'Unauthorized'})
                                },{ 
                                    response:{
                                        200:t.Object({
                                            data:t.Array(
                                                t.Object({
                                                    id:t.String({format:'uuid',description:'The Id of the file'}),
                                                    name:t.String({description:'The user provided name of the file'}),
                                                    category:t.Union([t.String({description:'The category of the file'}),t.Null()]),
                                                    uploaded_date:t.String({description:'The uploaded date of the file in string format (due to bug in framework)'})
                                            }))
                                        }),
                                        401:Error,
                                        500:Error,
                                    },
                                    cookie:cookie,
                                    detail:{
                                        summary:'Get user uploads',
                                        tags:['Uploads'],
                                        description:'Gets a list that the user has uploaded. Note, only shows own files',

                                    }
                                    
                                })
                                .post('/', async function uploadAudio({body:{name,category,file},status,cookie,log}){
                                    const {sessionToken} = cookie;
                                    const userSession = session(sessionToken)
                                    if(userSession.user){
                                        try{ 
                                            const results = await userUploadFile(userSession.user,file,name,category)
                                            if(results && results.id) return {success:true,id:results.id}
                                            log.error(results.error)
                                            return status(500,{error:'error uploading'})
                                        }
                                        catch(error:any){
                                            log.error(error.message)
                                            return status(500,{error:'error uploading'})
                                        }
                                    }
                                    return status(401,{error:'unauthorized'})
                                },{
                                    body:t.Object({
                                        name:t.String({description:'The name of the file. Can be of string length 0 if the user do not want to name it'}),
                                        category:t.String({description:'The category of the file'}),
                                        file:t.File({description:`The audio file. Currently set to max ${MAX_FILE_UPLOAD} bytes`})
                                    }),
                                    cookie:cookie,
                                    response:{
                                        200:t.Object({
                                            success:t.Boolean({description:'If the upload was successful'}),
                                            id:t.String({description:'The id of the file'})
                                        }),
                                        500:Error,
                                        401:Error,
                                        400:Error
                                    },
                                    detail:{
                                        summary:'Upload an audio file with metadata',
                                        tags:['Uploads'],
                                        description:'Uploads an audio file. Note: The file must be uploaded using multipart/form-data content-type',
                                    }
                                    
                                })
                                .get('/categories',async function getCategories({status,cookie,log}){
                                    const {sessionToken} = cookie;
                                    const userSession = session(sessionToken);
                                    if(userSession.user){
                                        try{
                                            const results = await getCategory();
                                            if(!results) return status(404,{error:"no categories found"});
                                            return results
                                        }
                                        catch(error:any){
                                            log(error.message)
                                            return status(500,{error:"Internal Server Error"})
                                        }
                                    }
                                    return status(401,{error:"Unauthorized"})

                                },{
                                    response:{
                                        200:t.Array(t.Object({
                                            id:t.Number({description:'Id of the Category'}),
                                            name:t.String({description:'The name of the category'})
                                        })),
                                        401:Error,
                                        404:Error,
                                        500:Error
                                    },
                                    cookie:cookie,
                                    detail:{
                                        summary:'Get audio categories',
                                        tags:['Uploads'],
                                        description:'Gets the audio categories currently present in the app',

                                    }
                                })
                                .get('/url/:id',async function getfileUrl({params:{id},status,cookie,log}){
                                    const {sessionToken} = cookie;
                                    const userSession = session(sessionToken)
                                    if(userSession.user){
                                        try{ 
                                            const results = await getUrl(userSession.user,id)
                                            if(!results) return status(404,{error:'Not found'})
                                            return results
                                        }
                                        catch(error:any){
                                            log.error(error.message)
                                            return status(500,{error:'error getting URL'})
                                        }
                                    }
                                    return status(401,{error:'unauthorized'})

                                },{
                                    params:t.Object({
                                        id:t.String({format:'uuid', description:'ID of the file'})
                                    }),
                                    response:{
                                        200:t.String({description:'URL of the file'}),
                                        404:Error,
                                        500:Error,
                                        401:Error
                                    },
                                    cookie:cookie,
                                    detail:{
                                        summary:'Get presigned s3 link of the file',
                                        tags:['Uploads'],
                                        description:'Gets the presigned s3 link of the file for th euser to download. Links are available for an hour.',

                                    }
                                })