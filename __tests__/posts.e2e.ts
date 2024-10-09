import request from 'supertest';
import {app} from '../src/app';
import {SETTINGS} from '../src/settings';
import {ObjectId} from "mongodb";

const blogsTestDataset = [
   {"name": "name 1", "description": "description 1", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 2", "description": "description 2", "websiteUrl": "https://ya.ru/news1"}
]

const postsTestDataset = [
   {"title": "Title 1", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Title 2", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Title 3", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Title 4", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Title 5", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Title 6", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Title 7", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Title 8", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Title 9", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Thor 1", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Thor 2", "shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Thor 3", "shortDescription": "Short Description 1", "content": "Content 1"}
]

const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
//default paginator
// {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []}

describe('/posts', () => {
   // PHASE 0. Clearing database
   beforeAll(async () => {
      await request(app)
         .delete(SETTINGS.PATH.TESTING)
         .expect(204)
   })
   //PHASE 1.	GET. Test code 200 and []
   it('GET /posts return code 200 and empty array', async () => {
         await request(app)
            .get(SETTINGS.PATH.POSTS)
            .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
      }
   )

   //PHASE 2. 2.	POST with wrong data. Check that every validator works and returns code 400.
   //Then (!) check that GET still returns empty array
   it('POST /posts check all common-middleware', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      const newBlogResponse = await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "Name1",
            "description": "Description1",
            "websiteUrl": "https://example.com/"
         })
      expect(newBlogResponse.statusCode).toBe(201)
      const blogID: string = newBlogResponse.body.id
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .send({
            "title": "string",
            "shortDescription": "string",
            "content": "string",
            "blogId": "string"
         })
         .expect(401)
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "shortDescription": "string",
            "content": "string",
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Title is required',
                  field: "title"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "",
            "shortDescription": "string",
            "content": "string",
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Title is required',
                  field: "title"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": true,
            "shortDescription": "string",
            "content": "string",
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Title must be a string',
                  field: "title"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "a".repeat(40),
            "shortDescription": "string",
            "content": "string",
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Length of the post title must be between 1 and 30 characters',
                  field: "title"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "content": "string",
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Short description is required',
                  field: "shortDescription"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": "",
            "content": "string",
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Short description is required',
                  field: "shortDescription"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": true,
            "content": "string",
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Short description must be a string',
                  field: "shortDescription"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": "a".repeat(110),
            "content": "string",
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Length of the short description must be between 1 and 100 characters',
                  field: "shortDescription"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": "string",
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Content is required',
                  field: "content"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": "string",
            "content": "",
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Content is required',
                  field: "content"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": "string",
            "content": true,
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Content must be a string',
                  field: "content"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": "string",
            "content": "a".repeat(1010),
            "blogId": blogID
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Length of the content must be between 1 and 1000 characters',
                  field: "content"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": "string",
            "content": "string"
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Blog ID is required',
                  field: "blogId"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": "string",
            "content": "string",
            "blogId": ""
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Blog ID is required',
                  field: "blogId"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": "string",
            "content": "string",
            "blogId": true
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Blog ID must be a string',
                  field: "blogId"
               }]
            }
         )
      await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "string",
            "shortDescription": "string",
            "content": "string",
            "blogId": new ObjectId().toString()
         })
         .expect(400, {
               "errorsMessages": [{
                  message: 'Blog ID is invalid',
                  field: "blogId"
               }]
            }
         )
      await request(app)
         .get(SETTINGS.PATH.POSTS)
         .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
      await request(app)
         .delete(SETTINGS.PATH.BLOGS + "/" + blogID)
         .set({"authorization": 'Basic ' + codedAuth})
         .expect(204)
   })
   // PHASE 3.	Successful POST with correct data + GET to be sure that POST created record
   it('POST /blogs with correct data and then GET it', async () => {
      const resBlog1 = await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "Name1",
            "description": "Description1",
            "websiteUrl": "https://example.com/"
         })
      const blogID = resBlog1.body.id
      const checkBlog1 = await request(app)
         .get(SETTINGS.PATH.BLOGS + "/" + blogID)
      expect(checkBlog1.statusCode).toBe(200)
      const resBlog2 = await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "Name2",
            "description": "Description2",
            "websiteUrl": "https://example2.com/"
         })
      const blogID2 = resBlog2.body.id
      const checkBlog2 = await request(app)
         .get(SETTINGS.PATH.BLOGS + "/" + blogID2)
      expect(checkBlog2.statusCode).toBe(200)
      const resPost = await request(app)
         .post(SETTINGS.PATH.POSTS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "Title1",
            "shortDescription": "shortDescription1",
            "content": "content1",
            "blogId": blogID
         })
      const postID: string = resPost.body.id
      expect(resPost.body).toEqual(
         expect.objectContaining({
            id: postID,
            title: "Title1",
            shortDescription: "shortDescription1",
            content: "content1",
            blogId: blogID,
            blogName: "Name1",
            createdAt: expect.any(String)
         })
      )
      const resGet = await request(app)
         .get(SETTINGS.PATH.POSTS + "/" + postID)
      expect(resGet.statusCode).toBe(200)
      expect(resGet.body).toEqual(
         expect.objectContaining({
            id: postID,
            title: "Title1",
            shortDescription: "shortDescription1",
            content: "content1",
            blogId: blogID,
            blogName: "Name1",
            createdAt: expect.any(String)
         })
      )
      await request(app)
         .put(SETTINGS.PATH.POSTS + "/" + new ObjectId().toString())
         .send({
            "title": "Title2",
            "shortDescription": "shortDescription2",
            "content": "content2",
            "blogId": blogID2
         })
         .expect(401)
      await request(app)
         .put(SETTINGS.PATH.POSTS + "/" + postID)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "title": "Title2",
            "shortDescription": "shortDescription2",
            "content": "content2",
            "blogId": blogID2
         })
         .expect(204)
      const resGetPutted = await request(app)
         .get(SETTINGS.PATH.POSTS + "/" + postID)
      expect(resGetPutted.statusCode).toBe(200)
      // console.log(`blogID1: ${blogID}, blogID2: ${blogID2}, postID: ${postID}`)
      expect(resGetPutted.body).toEqual(
         expect.objectContaining({
            id: postID,
            title: "Title2",
            shortDescription: "shortDescription2",
            content: "content2",
            blogId: blogID2,
            blogName: "Name2",
            createdAt: expect.any(String)
         }))
      await request(app)
         .delete(SETTINGS.PATH.BLOGS + "/" + blogID)
         .expect(401)
      await request(app)
         .delete(SETTINGS.PATH.BLOGS + "/" + blogID)
         .set({"authorization": 'Basic ' + codedAuth})
         .expect(204)
      await request(app)
         .delete(SETTINGS.PATH.BLOGS + "/" + blogID2)
         .set({"authorization": 'Basic ' + codedAuth})
         .expect(204)
      await request(app)
         .delete(SETTINGS.PATH.POSTS + "/" + postID)
         .set({"authorization": 'Basic ' + codedAuth})
         .expect(204)
   }, 10000)
   it('create test dataset for posts paginator tests', async () => {
      const blogIds: ObjectId[] = []
      for (const el of blogsTestDataset) {
         const blogPostResult = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set({"authorization": 'Basic ' + codedAuth})
            .send(el)
            .expect(201)
         blogIds.push(blogPostResult.body.id)
      }
      for (const el of postsTestDataset) {
         const postPostResult = await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set({"authorization": 'Basic ' + codedAuth})
            .send({...el, blogId: blogIds[0]})
            .expect(201)
      }
      const searchForThor = await request(app)
         .get(SETTINGS.PATH.POSTS)
         .query({pageSize: 3, pageNumber: 4, sortDirection: 'asc'})
      expect(searchForThor.statusCode).toBe(200)
      expect(searchForThor.body).toEqual({
         pagesCount: 4, page: 4, pageSize: 3, totalCount: 12, items: [
            expect.objectContaining({
               id: expect.any(String),
               title: postsTestDataset[9].title,
               content: postsTestDataset[9].content,
               shortDescription: postsTestDataset[9].shortDescription,
               createdAt: expect.any(String),
               blogId: blogIds[0],
               blogName: "name 1",
            }),
            expect.objectContaining({
               id: expect.any(String),
               title: postsTestDataset[10].title,
               content: postsTestDataset[10].content,
               shortDescription: postsTestDataset[10].shortDescription,
               createdAt: expect.any(String),
               blogId: blogIds[0],
               blogName: "name 1",
            }),
            expect.objectContaining({
               id: expect.any(String),
               title: postsTestDataset[11].title,
               content: postsTestDataset[11].content,
               shortDescription: postsTestDataset[11].shortDescription,
               createdAt: expect.any(String),
               blogId: blogIds[0],
               blogName: "name 1",
            }),
         ]
      })
   }, 20000)
   it('search for thor', async () => {

   })
})