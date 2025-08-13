import { Elysia,t } from 'elysia'
import {swagger} from '@elysiajs/swagger'
import { auth } from './auth'
import { cookieConfig } from './cookie.config'
import {logger} from '@bogeychan/elysia-logger'
import { manage } from './userMgt'
import { upload } from './upload'
import { swaggerMiddleware } from './middleware/swagger'
const app = new Elysia({prefix:'/api',	serve: {
		maxRequestBodySize: 1024 * 1024 * 256 // 256MB
	}})
					.use(swaggerMiddleware)
					.use(logger())
					.get('/', () => 'Hello Elysia',{detail:{summary:'Test API'}})
					.onError(({ code, error, set }) => {
						if (code === 'VALIDATION') {
							set.status = 400;
							return{error:error.message}
						}
						if(code === "INVALID_COOKIE_SIGNATURE"){
							set.status = 401;
							//delete cookie
							set.headers['set-cookie']='sessionToken=deleted; Max-Age=-1; Path=/; HttpOnly'
							return {error:error.message}
						}
						if(code==="NOT_FOUND"){
							set.status= 404;
							return{error:error.message}
						}
						set.status=500;
						return {error:"Internal Server Error"}
					})
					.use(auth)
					.use(manage)
					.use(upload)
					.listen(3000, ({ hostname, port }) => {
						console.log(
							`🦊 Elysia is running at ${hostname}:${port}`
						)})




export type API = typeof app
