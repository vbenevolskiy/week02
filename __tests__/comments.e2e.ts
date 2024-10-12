import request from "supertest";
import {SETTINGS} from "../src/settings";
import {app} from "../src/app";
import {ObjectId} from "mongodb";

const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
const basicAuthHeader = {"Authorization": "Basic " + codedAuth}

const clearDB = async (): Promise<void> => {
   await request(app)
      .delete(SETTINGS.PATH.TESTING)
      .expect(204)
}

const createBlog = async (name: string, description: string, websiteUrl: string): Promise<string | null> => {
   const createBlogResponse = await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set(basicAuthHeader)
      .send({name: name, description: description, websiteUrl: websiteUrl})
   if (createBlogResponse.statusCode === 201) return createBlogResponse.body.id
   return null
}

const createPost = async (title: string, shDesc: string, content: string, blogId: string): Promise<string | null> => {
   const createPostResponse = await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set(basicAuthHeader)
      .send({title: title, shortDescription: shDesc, content: content, blogId: blogId})
   if (createPostResponse.statusCode === 201) return createPostResponse.body.id
   return null
}

const createUser = async (login: string, password: string, email: string): Promise<string | null> => {
   const createUserResponse = await request(app)
      .post(SETTINGS.PATH.USERS)
      .set(basicAuthHeader)
      .send({login: login, password: password, email: email})
   if (createUserResponse.statusCode === 201) return createUserResponse.body.id
   return null
}

const getToken = async (loginOrEmail: string, password: string): Promise<string | null> => {
   const getTokenResponse = await request(app)
      .post(SETTINGS.PATH.AUTH + '/login')
      .send({loginOrEmail: loginOrEmail, password: password})
   if (getTokenResponse.statusCode === 200) return "Bearer " + getTokenResponse.body.accessToken
   return null
}

const createComment = async (content: string, postId: string, token: string): Promise<string | null> => {
   const createCommentResponse = await request(app)
      .post(SETTINGS.PATH.POSTS + "/" + postId + "/comments")
      .set({authorization: token})
      .send({content: content})
   if (createCommentResponse.statusCode === 201) return createCommentResponse.body.id
   return null
}

describe('/comments', () => {
   it('try to post comment without authorization',
      async () => {
         //clear DB
         await clearDB()
         //create one blog
         const blogId = await createBlog("name1", "description1", "https://ya.ru/news")
         expect(blogId).not.toBe(null)
         //create post
         const postId = await createPost("title1", "shortDescription1", "content1", blogId!)
         expect(postId).not.toBe(null)
         //create two users
         const userId1 = await createUser("user1", "q123Q123", "user1@gmail.com")
         expect(userId1).not.toBe(null)
         const userId2 = await createUser("user2", "q123Q123", "user2@gmail.com")
         expect(userId2).not.toBe(null)
         // get tokens for both users
         const token1 = await getToken("user1", "q123Q123")
         expect(token1).not.toBe(null)
         const token2 = await getToken("user2", "q123Q123")
         expect(token2).not.toBe(null)
         //try to post comment without Bearer auth
         const createComment1Res = await request(app)
            .post(SETTINGS.PATH.POSTS + "/" + postId + "/comments")
            .send({content: "This was nice post, bro. Take care"})
         expect(createComment1Res.statusCode).toBe(401)
         // trying to post comment with user1
         const postCommentRes = await request(app)
            .post(SETTINGS.PATH.POSTS + "/" + postId + "/comments")
            .set({"authorization": token1!})
            .send({content: "This was nice post, bro. Take care"})
         expect(postCommentRes.statusCode).toBe(201)
         const comment1Id = postCommentRes.body.id
         // try to get comment by ID with user1
         const getCommentByIdUser1Res = await request(app)
            .get(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .set({"authorization": token1!})
         expect(getCommentByIdUser1Res.statusCode).toBe(200)
         expect(getCommentByIdUser1Res.body).toEqual(
            expect.objectContaining({
               id: comment1Id,
               content: "This was nice post, bro. Take care",
               commentatorInfo: {
                  userId: userId1,
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
               commentatorInfo: {
                  userId: userId1,
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
            .set({"authorization": token1!})
            .send({content: "That was the worst post ever post, bro. Shut up!"})
            .expect(404)
         // try to put comment by other user
         await request(app)
            .put(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .set({"authorization": token2!})
            .send({content: "That was the worst post ever post, bro. Shut up!"})
            .expect(403)
         // try to put comment by correct user
         const putCommentCorrectRes = await request(app)
            .put(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .set({"authorization": token1!})
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
            .set({"authorization": token2!})
            .expect(403)
         // try to delete comment with wrong ID
         await request(app)
            .delete(SETTINGS.PATH.COMMENTS + '/' + wrongId)
            .set({"authorization": token1!})
            .expect(404)
         //try to delete comment by correct user
         await request(app)
            .delete(SETTINGS.PATH.COMMENTS + '/' + comment1Id)
            .set({"authorization": token1!})
            .expect(204)
         //clear DB
         await clearDB()
      }, 15000)
   
   it('test comments pagination', async () => {
      //clear DB
      await clearDB()
      //create one blog
      const blogId = await createBlog("name1", "description1", "https://ya.ru/news")
      expect(blogId).not.toBe(null)
      //create post
      const postId = await createPost("title1", "shortDescription1", "content1", blogId!)
      expect(postId).not.toBe(null)
      //create user
      const userId = await createUser("user1", "q123Q123", "user1@gmail.com")
      expect(userId).not.toBe(null)
      // get token for user
      const token = await getToken("user1", "q123Q123")
      expect(token).not.toBe(null)
      // create 12 comments
      const commentIDs: string[] = []
      for (let i = 0; i < 12; i++) {
         const commentId = await createComment(`content ${i}`, postId!, token!)
         expect(commentId).not.toBe(null)
         commentIDs.push(commentId!)
      }
      // check pagination 1 (pageSize: 2, p: 2, sort: asc)
      const paginationTest1 = await request(app)
         .get(SETTINGS.PATH.POSTS + '/' + postId + '/comments')
         .query({pageSize: 2, pageNumber: 2, sortDirection: 'asc'})
      expect(paginationTest1.statusCode).toBe(200)
      expect(paginationTest1.body).toEqual({
            pagesCount: 6, page: 2, pageSize: 2, totalCount: 12, items: [
               expect.objectContaining({
                  id: commentIDs[2],
                  content: 'content 2',
                  commentatorInfo: {
                     userId: userId,
                     userLogin: 'user1'
                  },
                  createdAt: expect.any(String)
               }),
               expect.objectContaining({
                  id: commentIDs[3],
                  content: 'content 3',
                  commentatorInfo: {
                     userId: userId,
                     userLogin: 'user1'
                  },
                  createdAt: expect.any(String)
               })
            ]
         })
      
      // clear DB
      // await clearDB()
   }, 15000)
})