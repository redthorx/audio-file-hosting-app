import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { hashPassword } from "../auth/cypto";

export async function isAdmin(username: string) {
  const results = await db
    .select({ isAdmin: usersTable.isAdmin })
    .from(usersTable)
    .where(eq(usersTable.username, username));
  if(results.length<1){
    return false
  }
  return results[0]!.isAdmin;
}
export async function updateUser(
  username: string,
  password?: string,
  isAdmin?: boolean
) {
  
  if(!password && isAdmin === undefined) return null;
  const valuesToUpdate: { pw_hash?: string; isAdmin?: boolean } = {};

  if (password) {
    valuesToUpdate.pw_hash =  hashPassword(password);
  }

  if (isAdmin !== undefined) {
    valuesToUpdate.isAdmin = isAdmin;
  }

    const results = await db
                            .update(usersTable)
                            .set(valuesToUpdate)
                            .where(eq(usersTable.username, username))
                            .returning({
                                id:usersTable.id
                            });
    if(results.length<1){
        return 404
    }
    return true
  
}

export async function deleteUser(username:string){
  const results = await db.delete(usersTable)
                          .where(eq(usersTable.username,username))
                          .returning({id:usersTable.id})
  if(results.length<1) return null
  return true
}

export async function getUsers(username?:string){
  
  const baseQuery = db.select({
                        id:usersTable.id,
                        username:usersTable.username,
                        isAdmin:usersTable.isAdmin
                        })
                        .from(usersTable)
                        .orderBy(usersTable.id);
  if(username){
    return await baseQuery.where(eq(usersTable.username,username));
  }
  return await baseQuery;


}