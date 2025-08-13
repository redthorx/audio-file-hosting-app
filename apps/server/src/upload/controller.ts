import { eq,and } from 'drizzle-orm'
import {db} from '../db'
import { audioCategoriesTable, audioUploads, usersTable } from '../db/schema'
import { S3Client,S3File,file } from 'bun';
import { BUCKET_NAME,MINIO_ADDRESS } from '../constants';
import { randomUUID } from 'node:crypto';

const s3client = new S3Client({
                                  bucket:BUCKET_NAME
                                })
const minioclient = MINIO_ADDRESS ? new S3Client({
                                    endpoint:MINIO_ADDRESS,
                                    bucket:BUCKET_NAME
                                }) : null;

export async function getUserFiles(username:string){
    const results = await db.select({
                                    id:audioUploads.id,
                                    name:audioUploads.name,
                                    category:audioUploads.category,
                                    uploaded_date:audioUploads.uploaded
                                })
                                .from(audioUploads)
                                .where(eq(audioUploads.user,username));
    //coerce date manually due to typing bug
    return results.map((result) => {
        return {
            ...result,
            uploaded_date: result.uploaded_date.toDateString()
        };
    });

}

export async function getUrl(username:string,fileId:string){
    const results = await db.select({
                                        id:audioUploads.id
                                    })
                                    .from(audioUploads)
                                    .where(and(
                                        eq(audioUploads.user,username),
                                        eq(audioUploads.id,fileId)
                                    ))
                                    .limit(1)
    if(results.length>1){
        return false;
    }
    let url;
    if(minioclient){
        url = minioclient.presign(fileId.concat('.mp3'),{ expiresIn:3600});
    }
    else{
        url = s3client.presign(fileId.concat('.mp3'),{ expiresIn:3600}); //url for 1h
    }
    return url
}
/**
 * Checks if the audio file exists
 * @param category category of the audio file
 */
export async function getCategory(category?:string){
    const query = db.select().from(audioCategoriesTable)

    if(category){
        query.where(eq(audioCategoriesTable.name,category))
    }
    const results = await query
    if(results.length<1){
        return false;
    }
    return results
}

export async function userUploadFile(username:string,file:File,name:string, category:string){
    //check category exists first, if it doesnt throw an error early
    const categoryExists = await getCategory(category)
    if(!categoryExists){
        return{id:null,error:'category does not exist'}
    }
    const fileId = randomUUID()
    // save as mp3 to make clients easier to retrieve the file
    const filename = fileId.concat('.mp3')
    const s3file:S3File = s3client.file(filename)
    s3file.write(file)
    //write to db
    const results = await db.insert(audioUploads)
                            .values({
                                    id:fileId,
                                    name:name,
                                    user:username,
                                    category:category
                                        })
                            .returning({id:audioUploads.id});
    if(results.length<1)return {error:'unknown error'}
    return {id:results[0]!.id, error:null};
                            
}

