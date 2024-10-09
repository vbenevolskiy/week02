import request from 'supertest';
import {app} from '../src/app';
import {SETTINGS} from '../src/settings';
import {ObjectId} from "mongodb";
import {BlogInputModel} from "../src/blogs/blogs-types";


const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
const blogsTestDataset: BlogInputModel[] = [
   {"name": "name 1", "description": "description 1", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 2", "description": "description 2", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 3", "description": "description 3", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 4", "description": "description 4", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 5", "description": "description 5", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 6", "description": "description 6", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 7", "description": "description 7", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 8", "description": "description 8", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 9", "description": "description 9", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 10", "description": "description 10", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 11", "description": "description 11", "websiteUrl": "https://ya.ru/news1"},
   {"name": "name 12", "description": "description 12", "websiteUrl": "https://ya.ru/news1"},
]

const postsTestDataset = [
   {"title": "Title 1","shortDescription": "Short Description 1", "content": "Content 1"},
   {"title": "Title 2","shortDescription": "Short Description 1", "content": "Content 1"}
]

//default paginator
//{ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] }

describe('/blogs', ()=>{
    // PHASE 0. Clearing database
   beforeAll(async()=>{
      await request(app)
         .delete(SETTINGS.PATH.TESTING)
         .expect(204)
   })
    //PHASE 1.	GET. Test code 200 and []
   it('GET /blogs return code 200 and empty array', async () => {
      await request(app)
         .get(SETTINGS.PATH.BLOGS)
         .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
      }
   )

    //PHASE 2. 2.	POST with wrong data. Check that every validator works and returns code 400.
    //Then (!) check that GET still returns empty array
   it('POST /blogs without auth', async ()=>{
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .send({
            "name": "",
            "description": "string",
            "websiteUrl": "https://ya.ru/news"
         })
            .expect(401)
   })
   it('POST /blogs without name field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "description": "string",
            "websiteUrl": "https://ya.ru/news"
         })
         .expect(400, {
            "errorsMessages" : [{
            message: 'Name is required',
            field: "name"}]
         })
   })
   it('POST /blogs with empty name field', async () => {
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "",
            "description": "string",
            "websiteUrl": "https://ya.ru/news"
         })
            .expect(400, {
            "errorsMessages" : [{
               message: 'Name is required',
               field: "name"}]
            })
   })
   it('POST /blogs with wrongly typed name field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": true,
            "description": "string",
            "websiteUrl": "https://ya.ru/news"
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'Blog name must be a string',
               field: "name"}]
         })
   })
   it('POST /blogs with too long name field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "description": "string",
            "websiteUrl": "https://ya.ru/news"
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'Length of the blog name must be between 1 and 15 characters',
               field: "name"}]
         })
   })
   it('POST /blogs without description field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "string",
            "websiteUrl": "https://ya.ru/news"
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'Description is required',
               field: "description"}]
         })
   })
   it('POST /blogs with empty description field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "description": "",
            "name": "string",
            "websiteUrl": "https://ya.ru/news"
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'Description is required',
               field: "description"}]
         })
   })
   it('POST /blogs with wrongly typed description field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "description": true,
            "name": "string",
            "websiteUrl": "https://ya.ru/news"
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'Blog description must be a string',
               field: "description"}]
         })
   })
   it('POST /blogs with too long description field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "description": "a".repeat(510),
            "name": "string",
            "websiteUrl": "https://ya.ru/news"
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'Length of the blog description must be between 1 and 500 characters',
               field: "description"}]
         })
   })
   it('POST /blogs without websiteURL field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "string",
            "description": "https://ya.ru/news"
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'WebsiteURL is required',
               field: "websiteUrl"}]
         })
   })
   it('POST /blogs with empty websiteUrl field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "description": "string",
            "name": "string",
            "websiteUrl": ""
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'WebsiteURL is required',
               field: "websiteUrl"}]
         })
   })
   it('POST /blogs with wrongly typed websiteUrl field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "description": "true",
            "name": "string",
            "websiteUrl": true
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'WebsiteURL must be a string',
               field: "websiteUrl"}]
         }
         )
   })
   it('POST /blogs with too long websiteUrl field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "description": "string",
            "name": "string",
            "websiteUrl": "a".repeat(110),
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'Length of the website URL must be between 1 and 100 characters',
               field: "websiteUrl"}]
         })
   })
   it('POST /blogs with invalid URL in websiteUrl field', async () => {
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "description": "string",
            "name": "string",
            "websiteUrl": "a".repeat(50),
         })
         .expect(400, {
            "errorsMessages" : [{
               message: 'Incorrect URL provided',
               field: "websiteUrl"}]
         })
   })
   it('GET /blogs still returns code 200 and empty array', async () => {
   await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
   })
    // PHASE 3.	Successful POST with correct data + GET to be sure that POST created record
   it('POST /blogs with correct data and then GET it', async ()=>{
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      const resPost = await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "Name1",
            "description": "Description1",
            "websiteUrl": "https://example.com/"
         })
      const id:string = resPost.body.id
      expect(resPost.body).toEqual(
         expect.objectContaining({
            id: expect.any(String),
            name: "Name1",
            description: "Description1",
            websiteUrl: "https://example.com/",
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean),
         })
      )
      const resGet = await request(app)
         .get(SETTINGS.PATH.BLOGS+"/"+id)
      expect(resGet.statusCode).toBe(200)
      expect(resGet.body).toEqual(
         expect.objectContaining({
            id: id,
            name: "Name1",
            description: "Description1",
            websiteUrl: "https://example.com/",
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean),
         })
      )
      await request(app)
         .delete(SETTINGS.PATH.BLOGS+"/"+id)
         .set({"authorization": 'Basic ' + codedAuth})
         .expect(204)
   })

    // PHASE 5. PUT record with correct data and check that record is changed
   it('PUT /blogs and check that record changes', async ()=>{
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      const resPost = await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "Name1",
            "description": "Description1",
            "websiteUrl": "https://example.com/",
         })
      const id:string = resPost.body.id
      await request(app)
         .put(SETTINGS.PATH.BLOGS+"/"+id)
         .send({
            "name": "Name2",
            "description": "Description2",
            "websiteUrl": "https://example2.com/",
         })
         .expect(401)
      await request(app)
         .put(SETTINGS.PATH.BLOGS+"/"+id)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "Name2",
            "description": "Description2",
            "websiteUrl": "https://example2.com/",
         })
         .expect(204)
      const resGet = await request(app)
         .get(SETTINGS.PATH.BLOGS+"/"+id)
      expect(resGet.statusCode).toBe(200)
      expect(resGet.body).toEqual(
         expect.objectContaining({
            id: id,
            name: "Name2",
            description: "Description2",
            websiteUrl: "https://example2.com/",
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean),
         })
      )
      await request(app)
         .delete(SETTINGS.PATH.BLOGS+"/"+id)
         .set({"authorization": 'Basic ' + codedAuth})
         .expect(204)
   })
    //PHASE 6. Attempting to delete /blogs with wrong id
   it('DELETE /blogs with wrong id', async ()=>{
      await request(app)
         .delete(SETTINGS.PATH.BLOGS+"/"+new ObjectId().toString())
         .expect(401)
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      await request(app)
         .delete(SETTINGS.PATH.BLOGS+"/"+new ObjectId().toString())
         .set({"authorization": 'Basic ' + codedAuth})
         .expect(404)
      })
    //PHASE 7. Attempting to DELETE /blogs with correct ID
   it('Attempting to DELETE /blogs with correct ID', async ()=>{
      const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
      const resPost = await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set({"authorization": 'Basic ' + codedAuth})
         .send({
            "name": "Name1",
            "description": "Description1",
            "websiteUrl": "https://example.com/",
         })
      const id:string = resPost.body.id
      await request(app)
         .delete(SETTINGS.PATH.BLOGS+"/"+id)
         .set({"authorization": 'Basic ' + codedAuth})
         .expect(204)
      await request(app)
         .get(SETTINGS.PATH.BLOGS+"/"+id)
         .expect(404)
      await request(app)
         .get(SETTINGS.PATH.BLOGS)
         .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
   })
    //PHASE: Testing pagination
   it('create test dataset for pagination tests',async ()=>{
      for (const el of blogsTestDataset){
         await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set({"authorization": 'Basic ' + codedAuth})
            .send(el)
            .expect(201)
      }
   })
   it("get with pageNumber = 2",async()=>{
      const result = await request(app)
         .get(SETTINGS.PATH.BLOGS)
         .query({pageNumber: '2'})
      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual({ pagesCount: 2, page: 2, pageSize: 10, totalCount: 12, items: [
         expect.objectContaining({
            id: expect.any(String),
            name: "name 2",
            description: "description 2",
            websiteUrl: "https://ya.ru/news1",
            createdAt: expect.any(String),
            isMembership: false,
         }),
         expect.objectContaining({
            id: expect.any(String),
            name: "name 1",
            description: "description 1",
            websiteUrl: "https://ya.ru/news1",
            createdAt: expect.any(String),
            isMembership: false,
         })
      ]})
   })
   it("get with pageNumber = 2 and asc order", async()=>{
   const result = await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .query({pageNumber: '2', sortDirection: 'asc'})
   expect(result.statusCode).toBe(200)
   expect(result.body).toEqual({ pagesCount: 2, page: 2, pageSize: 10, totalCount: 12, items: [
      expect.objectContaining({
         id: expect.any(String),
         name: "name 11",
         description: "description 11",
         websiteUrl: "https://ya.ru/news1",
         createdAt: expect.any(String),
         isMembership: false,
      }),
      expect.objectContaining({
         id: expect.any(String),
         name: "name 12",
         description: "description 12",
         websiteUrl: "https://ya.ru/news1",
         createdAt: expect.any(String),
         isMembership: false,
      })
   ]})
   })
   it("get with pageNumber = 3 and pageSize = 2 and asc order",async()=>{
      const result = await request(app)
         .get(SETTINGS.PATH.BLOGS)
         .query({pageNumber: '3', sortDirection: 'asc', pageSize: '2'})
      expect(result.statusCode).toBe(200)
      expect(result.body).toEqual({ pagesCount: 6, page: 3, pageSize: 2, totalCount: 12, items: [
         expect.objectContaining({
            id: expect.any(String),
            name: "name 5",
            description: "description 5",
            websiteUrl: "https://ya.ru/news1",
            createdAt: expect.any(String),
            isMembership: false,
         }),
         expect.objectContaining({
            id: expect.any(String),
            name: "name 6",
            description: "description 6",
            websiteUrl: "https://ya.ru/news1",
            createdAt: expect.any(String),
            isMembership: false,
         })
      ]})
   })
    // PHASE: Testing POSTING with endpoint /blogs/:id/posts
   it("preparing dataset for testing new endpoint /blogs/id/posts", async ()=>{
      await request(app)
         .delete(SETTINGS.PATH.TESTING)
         .expect(204)
      const randomObjectId = new ObjectId().toString()
      await request(app)
         .post(SETTINGS.PATH.BLOGS+"/"+randomObjectId+"/posts")
         .send(blogsTestDataset[0])
         .expect(401)
      await request(app)
         .post(SETTINGS.PATH.BLOGS+"/"+randomObjectId+"/posts")
         .set({"authorization": 'Basic ' + codedAuth})
         .send(postsTestDataset[0])
         .expect(404)
      const resNewBlog = await request(app)
         .post(SETTINGS.PATH.BLOGS)
         .set('authorization', 'Basic ' + codedAuth)
         .send(blogsTestDataset[0])
         .expect(201)
      const blogID = resNewBlog.body.id
      const resNewPost = await request(app)
         .post(SETTINGS.PATH.BLOGS+"/"+blogID+"/posts")
         .set('authorization', 'Basic ' + codedAuth)
         .send(postsTestDataset[0])
         .expect(201)
      expect(resNewPost.body).toEqual(expect.objectContaining({
         id: expect.any(String),
         title: postsTestDataset[0].title,
         content: postsTestDataset[0].content,
         shortDescription: postsTestDataset[0].shortDescription,
         createdAt: expect.any(String),
         blogId: blogID,
         blogName: "name 1",
      }))
      await request(app)
         .post(SETTINGS.PATH.BLOGS+"/"+new ObjectId().toString()+"/posts")
         .set('authorization', 'Basic ' + codedAuth)
         .send(postsTestDataset[1])
         .expect(404)
   }, 10000)
   // Testing searchNameTerm
   it("search for name 6", async ()=>{
      await request(app)
         .delete(SETTINGS.PATH.TESTING)
         .expect(204)
      for (const el of blogsTestDataset){
         await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set({"authorization": 'Basic ' + codedAuth})
            .send(el)
            .expect(201)
      }
      const searchResult = await request(app)
         .get(SETTINGS.PATH.BLOGS)
         .query({searchNameTerm: 'name 6'})
      expect(searchResult.statusCode).toBe(200)
      expect(searchResult.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [
         expect.objectContaining({
            id: expect.any(String),
            name: "name 6",
            description: "description 6",
            websiteUrl: "https://ya.ru/news1",
            createdAt: expect.any(String),
            isMembership: false
         })]
      })
      const searchResult2 = await request(app)
         .get(SETTINGS.PATH.BLOGS)
         .query({searchNameTerm: 'name 1', sortDirection: 'asc'})
      expect(searchResult2.statusCode).toBe(200)
      expect(searchResult2.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 4, items: [
            expect.objectContaining({
               id: expect.any(String),
               name: "name 1",
               description: "description 1",
               websiteUrl: "https://ya.ru/news1",
               createdAt: expect.any(String),
               isMembership: false
            }),
            expect.objectContaining({
               id: expect.any(String),
               name: "name 10",
               description: "description 10",
               websiteUrl: "https://ya.ru/news1",
               createdAt: expect.any(String),
               isMembership: false
            }),
            expect.objectContaining({
               id: expect.any(String),
               name: "name 11",
               description: "description 11",
               websiteUrl: "https://ya.ru/news1",
               createdAt: expect.any(String),
               isMembership: false
            }),
            expect.objectContaining({
               id: expect.any(String),
               name: "name 12",
               description: "description 12",
               websiteUrl: "https://ya.ru/news1",
               createdAt: expect.any(String),
               isMembership: false
            }),
         ]
      })
   }, 10000)
})