// session context manager

import { Elysia,t } from 'elysia'
import { cookieConfig } from '../cookie.config'
import { SECRET_KEY, SESSION_COOKIE_EXPIRES } from '../constants'
import { auth } from '../auth'
import { ElysiaCookie } from 'elysia/cookies'

interface SessionData{
    user?:string,
    exp?:number
}
type SessionToken = Omit<ElysiaCookie, 'secrets'> & {
  secrets?: string | string[] | undefined;
}

export function session(sessionToken:SessionToken){
    if(typeof sessionToken.value === 'string'){
        const decodedSessionToken = decodeURIComponent(sessionToken.value);
        const {user,exp} = JSON.parse(decodedSessionToken) as SessionData;
        if(!user || !exp){
            return {user:null}
        }
        if(exp> Date.now() && user){
            return {user:user}
        }
        //invalid expiry
        sessionToken.value = 'deleted';
        sessionToken.maxAge = -1
        return {user:null}

    }
    return {user:null}
}

export function setSessionToken(user:string |null,sessionToken:SessionToken){
    if(user){
        const expiry = Date.now()+SESSION_COOKIE_EXPIRES
        sessionToken.value = JSON.stringify({user:user,exp:expiry})
        return;
    }
    sessionToken.value= 'deleted'
    sessionToken.maxAge = -1
}

export const session2 = new Elysia({cookie:cookieConfig})
                                    .derive({'as':'scoped'},({cookie:{username,exp},set,status})=>{
                                        if(username?.value && exp?.value){
                                            if(parseInt(exp.value) > Date.now()){
                                                return {
                                                    user:username.value
                                                }
                                            }
                                        }
                                        return {
                                            user:null
                                        }

                                    })
