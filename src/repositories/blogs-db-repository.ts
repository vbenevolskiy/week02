import {BlogInputModel, BlogViewModel, RequestBody} from "../types";
import {dbClient, dbName} from "./db";
import {Collection} from 'mongodb'

export type BlogsRepository = {
    blogs: Collection<BlogViewModel>,
    isValidBlogId: (id: string) => Promise<boolean>,
    getBlogNameById: (id: string) => Promise<string>,
    getAllBlogs: () => Promise<BlogViewModel[]>,
    getBlogById: (id: string) => Promise<BlogViewModel | null>,
    createBlog: (req: RequestBody<BlogInputModel>) => Promise<BlogViewModel>,
    updateBlog: (id: string, req: RequestBody<BlogInputModel>) => Promise<boolean>,
    deleteBlog: (id: string) => Promise<boolean>
}

export const blogsRepository: BlogsRepository = {
    blogs: dbClient.db(dbName).collection<BlogViewModel>("blogs"),

    isValidBlogId: async (id: string): Promise<boolean> => {
        const dbResult: BlogViewModel | null = await blogsRepository.blogs.findOne({id:id})
        return !!dbResult
    },

    getBlogNameById: async (id: string): Promise<string> => {
        const dbResult: BlogViewModel | null  = await blogsRepository.blogs.findOne({id: id})
        if (dbResult) return dbResult.name
        else return ""
    },

    getAllBlogs: async (): Promise<BlogViewModel[]> => {
        return blogsRepository.blogs.find({}).toArray()
    },

    getBlogById: async (id: string): Promise<BlogViewModel | null> => {
        return await blogsRepository.blogs.findOne({id:id})
    },

    createBlog: async (req: RequestBody<BlogInputModel>): Promise<BlogViewModel> => {
        const now = new Date();
        const min = Math.ceil(12);
        const max = Math.floor(97);
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        const newBlog: BlogViewModel = {
            id: Number(now).toString()+rand.toString(),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: now.toISOString(),
            isMembership: false
        }
        await blogsRepository.blogs.insertOne(newBlog)
        console.log(newBlog)
        return newBlog
    },

    updateBlog: async (id: string, req: RequestBody<BlogInputModel>): Promise<boolean> => {
        const newValues = {$set: {name: req.body.name, description: req.body.description, websiteUrl: req.body.websiteUrl}}
        const dbResult = await blogsRepository.blogs.updateOne({id: id},newValues)
        return dbResult.matchedCount === 1
    },

    deleteBlog: async (id: string): Promise<boolean> => {
        const dbResult = await blogsRepository.blogs.deleteOne({id: id})
        return dbResult.deletedCount === 1
    }
}