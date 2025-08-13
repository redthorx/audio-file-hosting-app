import { DrizzleQueryError } from "drizzle-orm"
import { DatabaseError } from "pg"
export function isUniqueConstraintError(error:Error){
                                            if(error instanceof DrizzleQueryError){
                                                if(error.cause instanceof DatabaseError){
                                                    if (error.cause.code === "23505") {
                                                        return true
                                                    }
                                                    console.log(error.cause.code)                                          
                                                }
                                            }
}