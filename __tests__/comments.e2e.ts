import request from "supertest";
import {SETTINGS} from "../src/settings";
import {app} from "../src/app";
import {ObjectId} from "mongodb";

const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
const basicAuthHeader = {"Authorization": "Basic " + codedAuth}

describe('/comments', () => {
   it('try to post comment without authorization',
      async () => {
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
         expect(createPost2Res.statusCode).toBe(201)
         const post2Id = createPost2Res.body.id
         //create two users
         const createUser1Res = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set(basicAuthHeader)
            .send({login: "user1", password: "q123Q123", email: "user1@gmail.com"})
         expect(createUser1Res.statusCode).toBe(201)
         const user1Id = createUser1Res.body.id
         expect(createUser1Res.body).toEqual(
            expect.objectContaining({
               id: user1Id,
               login: 'user1',
               email: 'user1@gmail.com',
               createdAt: expect.any(String),
            })
         )
         const createUser2Res = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set(basicAuthHeader)
            .send({login: "user2", password: "q123Q123", email: "user2@gmail.com"})
         expect(createUser2Res.statusCode).toBe(201)
         const user2Id = createUser2Res.body.id
         expect(createUser2Res.body).toEqual(
            expect.objectContaining({
               id: user2Id,
               login: 'user2',
               email: 'user2@gmail.com',
               createdAt: expect.any(String),
            })
         )
         //try to post comment without Bearer auth
         const createComment1Res = await request(app)
            .post(SETTINGS.PATH.POSTS + "/" + post1Id + "/comments")
            .send({content: "This was nice post, bro. Take care"})
         expect(createComment1Res.statusCode).toBe(401)
         //get tokens for both users
         const getTokenUser1Res = await request(app)
            .post(SETTINGS.PATH.AUTH + '/login')
            .send({loginOrEmail: 'user1', password: 'q123Q123'})
         expect(getTokenUser1Res.statusCode).toBe(200)
         const token1 = getTokenUser1Res.body.accessToken
         const fullToken1 = "Bearer " + String(token1)
         console.log(`fullToken1: ${fullToken1}`)
         const getTokenUser2Res = await request(app)
            .post(SETTINGS.PATH.AUTH + '/login')
            .send({loginOrEmail: 'user2', password: 'q123Q123'})
         expect(getTokenUser2Res.statusCode).toBe(200)
         const token2 = getTokenUser1Res.body.accessToken
         const fullToken2 = "Bearer " + String(token2)
         console.log(`fullToken2: ${fullToken2}`)
         // trying to post comment with user1 to post1
         const postCommentRes = await request(app)
            .post(SETTINGS.PATH.POSTS + "/" + post1Id + "/comments")
            .set({"authorization": fullToken1})
            .send({content: "This was nice post, bro. Take care"})
         expect(postCommentRes.statusCode).toBe(201)
         const comment1Id = postCommentRes.body.id
         console.log(`test. comment1Id: ${comment1Id}`)
         // try to get comment by ID with user1
         const getCommentByIdUser1Res = await request(app)
            .get(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .set({"authorization": fullToken1})
         expect(getCommentByIdUser1Res.statusCode).toBe(200)
         expect(getCommentByIdUser1Res.body).toEqual(
            expect.objectContaining({
               id: comment1Id,
               content: "This was nice post, bro. Take care",
               commentInfo: {
                  userId: user1Id,
                  userLogin: 'user1'
               },
               createdAt: expect.any(String),
            })
         )
         // try to get comment by ID without auth token
         const getCommentByIdUser2Res = await request(app)
            .get(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
         expect(getCommentByIdUser2Res.statusCode).toBe(200)
         expect(getCommentByIdUser2Res.body).toEqual(
            expect.objectContaining({
               id: comment1Id,
               content: "This was nice post, bro. Take care",
               commentInfo: {
                  userId: user1Id,
                  userLogin: 'user1'
               },
               createdAt: expect.any(String),
            })
         )
         //try to get comment with wrong id
         const wrongId = String(new ObjectId())
         await request(app)
            .get(SETTINGS.PATH.COMMENTS + '/' + wrongId)
            .expect(404)
         // ------- PUT --------
         //try to PUT without auth header
         await request(app)
            .put(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .send({content: "That was the worst post ever post, bro. Shut up!"})
            .expect(401)
         // try to put comment with wrong ID
         await request(app)
            .put(SETTINGS.PATH.COMMENTS + '/' + wrongId)
            .set({"authorization": fullToken1})
            .send({content: "That was the worst post ever post, bro. Shut up!"})
            .expect(404)
         // try to put comment by other user
         await request(app)
            .put(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .set({"authorization": fullToken2})
            .send({content: "That was the worst post ever post, bro. Shut up!"})
            .expect(403)
         // try to put comment by correct user
         const putCommentCorrectRes = await request(app)
            .put(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .set({"authorization": fullToken1})
            .send({content: "That was the worst post ever post, bro. Shut up!"})
         expect(putCommentCorrectRes.statusCode).toBe(204)
         // ------ DELETE ---------
         // try to delete without auth header
         await request(app)
            .delete(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .expect(401)
         // try to delete comment by wrong user
         await request(app)
            .delete(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .set({"authorization": fullToken2})
            .expect(403)
         // try to delete comment with wrong ID
         await request(app)
            .delete(SETTINGS.PATH.COMMENTS + '/' + wrongId)
            .set({"authorization": fullToken2})
            .expect(404)
         //try to delete comment by correct user
         await request(app)
            .delete(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .set({"authorization": fullToken1})
            .expect(204)
         //clear DB
         await request(app)
            .delete(SETTINGS.PATH.TESTING)
            .expect(204)
      }, 10000)
})