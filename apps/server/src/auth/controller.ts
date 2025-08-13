
import {db} from '../db'
import { eq,and } from 'drizzle-orm'
import { usersTable } from '../db/schema'
import { hashPassword, verifyPassword } from './cypto'


export async function createUser(username:string,password:string){
    const passwordHash = hashPassword(password)
    console.log(passwordHash)
    await db.insert(usersTable).values({
        username:username,
        pw_hash:passwordHash
    })
}

export async function validateUser(username:string, password:string){
    const users = await db.select()
                            .from(usersTable)
                            .where(
                                 eq(usersTable.username,username),
                            )
                            .limit(1)
    if(users.length<1){
        return null
    }
    if(verifyPassword(password,users[0]!.pw_hash)){
        return{
            username:users[0]!.username
        }
    }
    else{
        return null;
    }
}

export async function getUser(username:string){

    const users = await db.select()
                            .from(usersTable)
                            .where(
                                 eq(usersTable.username,username),
                            )
                            .limit(1)
    if(users.length<1){
        return null
    }
    return{username:users[0]!.username,isAdmin:users[0]!.isAdmin}
}