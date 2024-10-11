import {UserInputModel} from "../src/users/users-types";
import request from "supertest";
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";

const usersTestDataset: UserInputModel[] = Array(2)
   .join()
   .split(",")
   .map((_val, ind) => {
      return {
         login: "user" + ind,
         password: "q123Q123"+ind,
         email: "user"+ind+"@gmail.com"
      };
   });

const LOGIN = SETTINGS.PATH.AUTH+'/login'
const ME = SETTINGS.PATH.AUTH+'/me';

const codedAuth = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8').toString('base64')
const authHeader = {"Authorization": "Basic " + codedAuth}

describe('/auth', ()=>{
   beforeAll(async () => {
      await request(app)
         .delete(SETTINGS.PATH.TESTING)
         .expect(204)
   })
   it('auth with wrong fields and analyze errors', async ()=>{
      //check with no loginOrEmail
      await request(app)
         .post(LOGIN)
         .send({password: "q123Q1230"})
         .expect(400, {errorsMessages: [{message: "Login or email is required", field: "loginOrEmail"}]})
      //check with wrongly types loginOrEmail
      await request(app)
         .post(LOGIN)
         .send({loginOrEmail: true, password: "q123Q1230"})
         .expect(400, {errorsMessages: [{message: "Login or email must be a string", field: "loginOrEmail"}]})
      //check with no password
      await request(app)
         .post(LOGIN)
         .send({loginOrEmail: "user1"})
         .expect(400, {errorsMessages: [{message: "Password is required", field: "password"}]})
      //check with wrongly typed password
      await request(app)
         .post(LOGIN)
         .send({loginOrEmail: "user1", password: true})
         .expect(400, {errorsMessages: [{message: "Password must be a string", field: "password"}]})
   })
   it('create test users and check auth results', async ()=>{
      // create test users
      for (const el of usersTestDataset) {
         const res = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set(authHeader)
            .send(el)
         expect(res.statusCode).toBe(201)
      }
      //check correct user user0 with login and pws q123Q1230
      const authUser0ByLogin = await request(app)
         .post(LOGIN)
         .send({loginOrEmail: "user0", password: "q123Q1230"})
      expect(authUser0ByLogin.statusCode).toBe(200)
      expect(authUser0ByLogin.body).toEqual(expect.objectContaining({accessToken: expect.any(String)}))
      //check correct user user0 with email and pws q123Q1231
      const authUser0ByEmail = await request(app)
         .post(LOGIN)
         .send({loginOrEmail: "user0@gmail.com", password: "q123Q1230"})
      expect(authUser0ByEmail.statusCode).toBe(200)
      expect(authUser0ByEmail.body).toEqual(expect.objectContaining({accessToken: expect.any(String)}))
      //check user with incorrect login
      const authUserWithWrongLogin = await request(app)
         .post(LOGIN)
         .send({loginOrEmail: "user500", password: "q123Q1230"})
      expect(authUserWithWrongLogin.statusCode).toBe(401)
      //check user with incorrect email
      const authUserWithWrongEmail = await request(app)
         .post(LOGIN)
         .send({loginOrEmail: "user500@gmail.com", password: "q123Q1230"})
      expect(authUserWithWrongEmail.statusCode).toBe(401)
      //check user with incorrect password
      const authUserWithWrongPwd = await request(app)
         .post(LOGIN)
         .send({loginOrEmail: "user0@gmail.com", password: "bullshit"})
      expect(authUserWithWrongPwd.statusCode).toBe(401)
   }, 10000)
   it('get me without header', async ()=>{
      await request(app)
         .get(ME)
         .expect(401)
   })
   it('get me with correct header', async ()=>{
      const loginResponse = await request(app)
         .post(LOGIN)
         .send({loginOrEmail: "user0@gmail.com", password: "q123Q1230"})
      const token = loginResponse.body.accessToken
      console.log(token)
      const meResponse = await request(app)
         .get(ME)
         .set("Authorization", `Bearer ${token}`)
      expect(meResponse.statusCode).toBe(200)
      expect(meResponse.body).toEqual({
         email: "user0@gmail.com",
         login: "user0",
         userId: expect.any(String)
      })
      console.log(meResponse.body)


      await request(app)
         .delete(SETTINGS.PATH.TESTING)
         .expect(204)
   })
})