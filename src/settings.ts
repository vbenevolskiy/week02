import {config} from 'dotenv'

config()

export const SETTINGS = {
   PORT: process.env.PORT || 5000,
   PATH: {
      AUTH: '/hometask_06/api/auth',
      BLOGS: '/hometask_06/api/blogs',
      COMMENTS: '/hometask_06/api/comments',
      POSTS: '/hometask_06/api/posts',
      TESTING: '/hometask_06/api/testing/all-data',
      USERS: '/hometask_06/api/users',
   },
   COLLECTIONS: {
      BLOGS: 'blogs',
      COMMENTS: 'comments',
      POSTS: 'posts',
      USERS: 'users'
   },
   SECURITY: {
      SALT_ROUNDS: 10,
      JWT_SECRET_KEY: process.env.SECRET_KEY || "interstellar",
      JWT_EXPIRATIONS_TIME: "600s"
   },
   EMAIL: {
     ACCOUNT: 'backend.sifu@gmail.com',
     PASSWORD: 'q123Q123!!'
   },
   ADMIN_AUTH: 'admin:qwerty',
   // MONGO_URI: 'mongodb://localhost:27017',
   MONGO_URI: 'mongodb+srv://vvb:q123Q123!!@vbcluster.y0j19.mongodb.net/?retryWrites=true&w=majority&appName=vbcluster',
   DB_NAME: 'snet'
}