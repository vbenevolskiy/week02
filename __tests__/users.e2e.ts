import request from 'supertest';
import {app} from '../src/app';
import {SETTINGS} from '../src/settings';
import {UserInputModel} from "../src/users/users-types";

const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
const authHeader = {"Authorization": "Basic " + codedAuth}

const usersTestDataset: UserInputModel[] = Array(12)
   .join()
   .split(",")
   .map((_val, ind) => {
      return {
         login: "user" + ind,
         password: "q123Q123",
         email: "user"+ind+"@gmail.com"
      };
   });

describe('/users', ()=> {
   // PHASE 0. Clearing database
   beforeAll(async () => {
      await request(app)
         .delete(SETTINGS.PATH.TESTING)
         .expect(204)
   })
   it('GET /users return code 200 and empty array', async () => {
         await request(app)
            .get(SETTINGS.PATH.USERS)
            .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
      }
   )
   it("Post correct user without auth", async ()=>{
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .send(usersTestDataset[0])
         .expect(401)
   })
   it('POST /users with wrong login field and check errors', async ()=>{
      //empty login
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            password: "q123Q123",
            email: "user1@gmail.com"
         })
         .expect(400, {errorsMessages: [{message: "Login is required", field: "login"}]})
      //login with wrong type
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: true,
            password: "q123Q123",
            email: "user1@gmail.com"
         })
         .expect(400, {errorsMessages: [{message: "Login must be a string", field: "login"}]})
      //too short login
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "us",
            password: "q123Q123",
            email: "user1@gmail.com"
         })
         .expect(400, {errorsMessages: [{message: "Length of the login must be between 3 and 10 characters", field: "login"}]})
      //too long login
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "u".repeat(15),
            password: "q123Q123",
            email: "user1@gmail.com"
         })
         .expect(400, {errorsMessages: [{message: "Length of the login must be between 3 and 10 characters", field: "login"}]})
      //login with incorrect characters
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "user 1",
            password: "q123Q123",
            email: "user1@gmail.com"
         })
         .expect(400, {errorsMessages: [{message: "Login could contain only upper- and lowercase letters, numbers, hyphen and underscore", field: "login"}]})
   })
   it('POST /users with incorrect password adn check errors', async ()=>{
      //empty password
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "user1",
            email: "user1@gmail.com"
         })
         .expect(400, {errorsMessages: [{message: "Password is required", field: "password"}]})
      //password with wrong type
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "user1",
            password: true,
            email: "user1@gmail.com"
         })
         .expect(400, {errorsMessages: [{message: "Password must be a string", field: "password"}]})
      //too short password < 6
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "user1",
            password: "123",
            email: "user1@gmail.com"
         })
         .expect(400, {errorsMessages: [{message: "Length of the password must be between 6 and 20 characters", field: "password"}]})
      //too long password > 20
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "user1",
            password: "123".repeat(15),
            email: "user1@gmail.com"
         })
         .expect(400, {errorsMessages: [{message: "Length of the password must be between 6 and 20 characters", field: "password"}]})
   })
   it('POST /users with wrong email field and check errors', async ()=>{
      //empty email
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "user1",
            password: "q123Q123"
         })
         .expect(400, {errorsMessages: [{message: "Email address is required", field: "email"}]})
      //email with wrong type
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "user1",
            email: true,
            password: "q123Q123"
         })
         .expect(400, {errorsMessages: [{message: "Email must be a string", field: "email"}]})
      //string which is not email
      await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "user1",
            email: "bull.shit",
            password: "q123Q123"
         })
         .expect(400, {errorsMessages: [{message: "Incorrect email address provided", field: "email"}]})
   })
   //still empty array after all tries with incorrect data
   it('GET /users return code 200 and empty array', async () => {
         await request(app)
            .get(SETTINGS.PATH.USERS)
            .expect(200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
      }
   )
   it('POST /users with correct data, then GET it and DELETE it', async ()=>{
      //create correct user and analyze response
      const createUserResponse = await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send(usersTestDataset[0])
      expect(createUserResponse.statusCode).toBe(201)
      const newUserId:string = createUserResponse.body.id
      expect(createUserResponse.body).toEqual(
         expect.objectContaining({
            id: newUserId,
            login: usersTestDataset[0].login,
            email: usersTestDataset[0].email,
            createdAt: expect.any(String),
         })
      )
      //check there is only one user in paginator
      const getAllUsers = await request(app)
         .get(SETTINGS.PATH.USERS)
      expect(getAllUsers.statusCode).toEqual(200)
      expect(getAllUsers.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [
         expect.objectContaining({
            id: newUserId,
            login: usersTestDataset[0].login,
            email: usersTestDataset[0].email,
            createdAt: expect.any(String),
         })
      ] })
      //delete created user
      await request(app)
         .delete(SETTINGS.PATH.USERS+"/"+newUserId)
         .set(authHeader)
         .expect(204)
   })
   it('Trying to POST /users with not unique login and / or email and check errors', async ()=>{
      //create user
      const createUserResponse = await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send(usersTestDataset[0])
      expect(createUserResponse.statusCode).toBe(201)
      const newUserId:string = createUserResponse.body.id
      //not unique login
      const createNonUniqueUserResponse = await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "user0",
            password: "q123Q123",
            email: "user100@gmail.com",
         })
      expect(createNonUniqueUserResponse.statusCode).toBe(400)
      expect(createNonUniqueUserResponse.body).toEqual({errorsMessages: [{message: "Login is not unique", field: "login"}]})
      //not unique email
      const createNonUniqueUserResponse2 = await request(app)
         .post(SETTINGS.PATH.USERS)
         .set(authHeader)
         .send({
            login: "user100",
            password: "q123Q123",
            email: "user0@gmail.com",
         })
      expect(createNonUniqueUserResponse2.statusCode).toBe(400)
      expect(createNonUniqueUserResponse2.body).toEqual({errorsMessages: [{message: "Email address is not unique", field: "email"}]})
      //check there is still only one user
      const getAllUsers = await request(app)
         .get(SETTINGS.PATH.USERS)
      expect(getAllUsers.statusCode).toEqual(200)
      expect(getAllUsers.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [
            expect.objectContaining({
               id: newUserId,
               login: usersTestDataset[0].login,
               email: usersTestDataset[0].email,
               createdAt: expect.any(String),
            })
         ] })
      //delete user
      await request(app)
         .delete(SETTINGS.PATH.USERS+"/"+newUserId)
         .set(authHeader)
         .expect(204)
   })
   it('Check /users pagination', async ()=>{
      //create test users
      for (const el of usersTestDataset) {
         const res = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set(authHeader)
            .send(el)
         expect(res.statusCode).toEqual(201)
      }
      //2 users per page, page 1, asc
      const getAllUsers = await request(app)
         .get(SETTINGS.PATH.USERS)
         .query({pageNumber: 1, pageSize: 2, sortDirection: 'asc'})
      expect(getAllUsers.statusCode).toEqual(200)
      expect(getAllUsers.body).toEqual({ pagesCount: 6, page: 1, pageSize: 2, totalCount: 12, items: [
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[0].login,
               email: usersTestDataset[0].email,
               createdAt: expect.any(String),
            }),
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[1].login,
               email: usersTestDataset[1].email,
               createdAt: expect.any(String),
            }),
         ]
      })
      //2 users per page, page 1, asc
      const getAllUsers2 = await request(app)
         .get(SETTINGS.PATH.USERS)
         .query({pageNumber: 2, pageSize: 3, sortDirection: 'desc'})
      expect(getAllUsers2.statusCode).toEqual(200)
      expect(getAllUsers2.body).toEqual({ pagesCount: 4, page: 2, pageSize: 3, totalCount: 12, items: [
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[8].login,
               email: usersTestDataset[8].email,
               createdAt: expect.any(String),
            }),
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[7].login,
               email: usersTestDataset[7].email,
               createdAt: expect.any(String),
            }),
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[6].login,
               email: usersTestDataset[6].email,
               createdAt: expect.any(String),
            }),
         ]
      })
      //test search for login
      const getAllUsers3 = await request(app)
         .get(SETTINGS.PATH.USERS)
         .query({searchLoginTerm: "user1", sortDirection: 'asc'})
      expect(getAllUsers3.statusCode).toEqual(200)
      expect(getAllUsers3.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 3, items: [
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[1].login,
               email: usersTestDataset[1].email,
               createdAt: expect.any(String),
            }),
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[10].login,
               email: usersTestDataset[10].email,
               createdAt: expect.any(String),
            }),
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[11].login,
               email: usersTestDataset[11].email,
               createdAt: expect.any(String),
            })
         ]
      })
      //test search for email
      const getAllUsers4 = await request(app)
         .get(SETTINGS.PATH.USERS)
         .query({searchEmailTerm: "user1", sortDirection: 'asc'})
      expect(getAllUsers4.statusCode).toEqual(200)
      expect(getAllUsers4.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 3, items: [
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[1].login,
               email: usersTestDataset[1].email,
               createdAt: expect.any(String),
            }),
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[10].login,
               email: usersTestDataset[10].email,
               createdAt: expect.any(String),
            }),
            expect.objectContaining({
               id: expect.any(String),
               login: usersTestDataset[11].login,
               email: usersTestDataset[11].email,
               createdAt: expect.any(String),
            })
         ]
      })
      await request(app)
         .delete(SETTINGS.PATH.TESTING)
         .expect(204)
   }, 15000)
})