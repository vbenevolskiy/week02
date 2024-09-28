import {BlogInputModel, BlogViewModel, RequestBody} from "../types";
import {dbClient, dbName} from "./db";
import {Collection} from 'mongodb'

export type BlogsRepository = {
    blogs: Collection<BlogViewModel>,
    isValidBlogId: (id: number) => Promise<boolean>,
    getBlogNameById: (id: number) => Promise<string>,
    getAllBlogs: () => Promise<BlogViewModel[]>,
    getBlogById: (id: number) => Promise<BlogViewModel | null>,
    createBlog: (req: RequestBody<BlogInputModel>) => Promise<BlogViewModel>,
    updateBlog: (id: number, req: RequestBody<BlogInputModel>) => Promise<boolean>,
    deleteBlog: (id: number) => Promise<boolean>
}

export const blogsRepository: BlogsRepository = {
    blogs: dbClient.db(dbName).collection<BlogViewModel>("blogs"),

    isValidBlogId: async (id: number): Promise<boolean> => {
        const dbResult: BlogViewModel | null = await blogsRepository.blogs.findOne({id:id.toString()})
        return !!dbResult
    },

    getBlogNameById: async (id: number): Promise<string> => {
        const dbResult: BlogViewModel | null  = await blogsRepository.blogs.findOne({id: id.toString()})
        if (dbResult) return dbResult.name
        else return ""
    },

    getAllBlogs: async (): Promise<BlogViewModel[]> => {
        return blogsRepository.blogs.find({}).toArray()
    },

    getBlogById: async (id: number): Promise<BlogViewModel | null> => {
        return await blogsRepository.blogs.findOne({id:id.toString()})
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
        return newBlog
    },

    updateBlog: async (id: number, req: RequestBody<BlogInputModel>): Promise<boolean> => {
        const newValues = {$set: {name: req.body.name, description: req.body.description, websiteUrl: req.body.websiteUrl}}
        const dbResult = await blogsRepository.blogs.updateOne({id: id.toString()},newValues)
        return dbResult.matchedCount === 1
    },

    deleteBlog: async (id: number): Promise<boolean> => {
        const dbResult = await blogsRepository.blogs.deleteOne({id: id.toString()})
        return dbResult.deletedCount === 1
    }
}