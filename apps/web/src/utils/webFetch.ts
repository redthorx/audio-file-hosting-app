/**
 * Fetchers for web calls
 */
import { data } from 'react-router';
import {createApiModel} from '../../../../packages/api-model'

console.log(import.meta.env.VITE_API_URL)
const apiModel = createApiModel(import.meta.env.VITE_API_URL!)
export async function testCall(){
    const{data,error} = await apiModel.api.get()
    if(data){
        return data;
    }
}
export async function getSession(){
    const{data,error} = await apiModel.api.auth.session.get({
        headers:{
            "x-csrf":"1"
        }
    })
    if(data && data.username ){
        return {username:data.username,isAdmin:!!data.isAdmin}
    }
    return {username:null,isAdmin:null}

}
export async function register(username:string, password:string){
    const {data,error} = await apiModel.api.auth.register.post({
                                                                    username:username,
                                                                    password:password
                                                                },{
                                                                    headers:{
                                                                        'x-csrf':'1'
                                                                    }
                                                                })
    if(data && data.success){
        return {success:true}
    }
    if(error){
        return{success:false,error:error.status}
    }
    return {success:false,error:'unknown error'}
}
export async function login(username:string, password:string){
    const {data,error} = await apiModel.api.auth.login.post({
                                                                username:username,
                                                                password:password
                                                            },{
                                                                headers:{
                                                                    'x-csrf':'1'
                                                                }
                                                            })
    if(data && data.success){
        return {username:data.username}
    }
    if(error?.status){
        return {error:error.status}
    }
    return {error:"unknown error"}
}

export async function logout(){
    const {data,error} = await apiModel.api.auth.logout.post({},{
                                                                headers:{
                                                                    'x-csrf':"1"
                                                                }
                                                            })
    if(error){
        return {error:error.value,success:null}
    }
    if(data){
        return data
    }
    return {error:'Unknown error',success:null}
}

export async function adminListUser(username?:string){
    const {data,error} = await apiModel.api.manage.user.get({query:{
                                                                username:username},
                                                            headers:{
                                                                'x-csrf':'1'
                                                            }})
    if(error){
        return {data:null, error:error.status}
    }
    return {data:data,error:null}
}

export async function updateUser(username:string, password?:string, setAdmin?:boolean){
    const {data,error} = await apiModel.api.manage.user.patch({
                                                                username:username,
                                                                password:password,
                                                                setAdmin:setAdmin
                                                            },{
                                                                headers:{
                                                                    'x-csrf':'1'
                                                                }
                                                            })
    if(error){
        return {error:error.value.toString(),success:null}
    }
    if(data){
        return {error:null,success:true}
    }
    return {error:'Unknown error',success:null}
}

export async function adminCreateUser(username:string,password:string){
    const {data,error} = await apiModel.api.manage.user.post({
                                                                username:username,
                                                                password:password
                                                            },{
                                                                headers:{
                                                                    'x-csrf':'1'
                                                                }
                                                            })
    if(data && data.success){
        return {success:true}
    }
    if(error){
        return{success:false,error:error.status}
    }
    return {success:false,error:'unknown error'}
}

export async function adminDeleteUser(username:string){
    const {data,error} = await apiModel.api.manage.user.delete({
                                                                username:username
                                                            },{
                                                                headers:{
                                                                    'x-csrf':'1'
                                                                }
                                                            })
    if(data && data.success){
        return {success:true}
    }
    if(error){
        return{success:false,error:error.status}
    }
    return {success:false,error:'unknown error'}
}

export async function getUserUploads(){
    const {data,error} = await apiModel.api.uploads.get({
                                                            headers:{
                                                                "x-csrf":"1"
                                                            }
                                                        })
                                    
    if(data){
        return {...data,error:null}
    }
    if(error){
        return{error:error.status,data:null}
    }
    return {data:null,error:"unknown error"}
}

export async function getAudioUrl(id:string){
    const {data,error} = await apiModel.api.uploads.url({id}).get({
                                                                headers:{
                                                                    'x-csrf':"1"
                                                                }
                                                            })
    if(error){
        return {error:error.status,url:null}
    }
    if(data){
        return{error:null,url:data}
    }                             
    return{error:"unknown error",url:null}                           
}
export async function getCategories(){
    const {data,error} = await apiModel.api.uploads.categories.get({
                                                                    headers:{
                                                                        'x-csrf':"1"
                                                                    }
                                                                });
    if(error){
        return{error:error.status,categories:null};
    }
    if(data){
        return{error:null,categories:data};
    }
    return{error:"unknown error",categories:null};
}
export async function uploadAudio(name:string,category:string,file:File){
    const {data,error} = await apiModel.api.uploads.post({
                                                            name,
                                                            category,
                                                            file
                                                        },{headers:{
                                                            'x-csrf':"1"
                                                        }})
   if(error){
    return{error:error.status,success:false}
   }
   return {error:null, success:data.success}                                 

}