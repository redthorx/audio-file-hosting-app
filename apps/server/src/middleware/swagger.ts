import {Elysia} from 'elysia'
import {swagger} from '@elysiajs/swagger'

export const swaggerMiddleware = new Elysia()
                    .use(swagger({
                    documentation:{
                        info:{
                            title: "Audio Upload App API Documentation",
                            version:process.env.VERSION || '1.0.0',
                            description: 'API documentation for Audio Upload App'
                        },
                        tags:[
                            {name: 'Uploads', description: 'API for uploading'},
                            {name: 'User Management', description: 'API for User Management, can only be accessed by Admins'},
                            {name:'Auth', description:'API for authentication'}
                        ],
                    },
                }))