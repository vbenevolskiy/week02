import request from "supertest";
import {SETTINGS} from "../src/settings";
import {app} from "../src/app";

const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
const basicAuthHeader = {"Authorization": "Basic " + codedAuth}

describe('/comments', ()=>{
   it ('try to post comment without authorization',
      async ()=>{
         //clear DB
         await request(app)
            .delete(SETTINGS.PATH.TESTING)
            .expect(204)
         //create one blog
         const createBlogRes = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set(basicAuthHeader)
            .send({name: "name 1", description: "description 1", websiteUrl: "https://ya.ru/news1"})
         expect(createBlogRes.statusCode).toBe(201)
         const blogId = createBlogRes.body.id
         //create two posts
         const createPost1Res = await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(basicAuthHeader)
            .send({title: "Title 1", shortDescription: "Short Description 1", content: "Content 1", blogId: blogId})
         expect(createPost1Res.statusCode).toBe(201)
         const post1Id = createPost1Res.body.id
         const createPost2Res = await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(basicAuthHeader)
            .send({title: "Title 2", shortDescription: "Short Description 2", content: "Content 2", blogId: blogId})
         expect(createPost1Res.statusCode).toBe(201)
         const post2Id = createPost2Res.body.id
         //create two users
         const createUser1Res = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set(basicAuthHeader)
            .send({login: "user1", password: "q123Q123", email: "user1@gmail.com"})
         expect(createUser1Res.statusCode).toBe(201)
         const user1Id = createUser1Res.body.id
         const createUser2Res = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set(basicAuthHeader)
            .send({login: "user2", password: "q123Q123!!", email: "user2@gmail.com"})
         expect(createUser1Res.statusCode).toBe(201)
         const user2Id = createUser1Res.body.id
         //try to post comment without Bearer auth
         const createComment1Res = await request(app)
            .post(SETTINGS.PATH.POSTS+"/"+post1Id+"/comments")
            .send({content: "This was nice post, bro. Take care"})
         expect(createComment1Res.statusCode).toBe(401)
      }, 10000)
})