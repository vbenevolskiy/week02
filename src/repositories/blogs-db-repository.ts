import {BlogInputModel, BlogViewModel, RequestBody} from "../types";
import {dbClient, dbName} from "./db";
import {Collection, ObjectId} from 'mongodb'

export type BlogDBModel = {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogsRepository = {
    blogs: Collection<BlogDBModel>,
    db2View: (el: BlogDBModel) => BlogViewModel,
    isValidBlogId: (id: string) => Promise<boolean>,
    getBlogNameById: (id: string) => Promise<string>,
    getAllBlogs: () => Promise<BlogViewModel[]>,
    getBlogById: (id: string) => Promise<BlogViewModel | null>,
    createBlog: (req: RequestBody<BlogInputModel>) => Promise<BlogViewModel>,
    updateBlog: (id: string, req: RequestBody<BlogInputModel>) => Promise<boolean>,
    deleteBlog: (id: string) => Promise<boolean>
}

export const blogsRepository: BlogsRepository = {
    blogs: dbClient.db(dbName).collection<BlogDBModel>("blogs"),

    db2View: (el:BlogDBModel):BlogViewModel =>{
        return {
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        }
    },

    isValidBlogId: async (id: string): Promise<boolean> => {
        const dbResult: BlogDBModel | null = await blogsRepository.blogs.findOne({_id:new ObjectId(id)})
        return !!dbResult
    },

    getBlogNameById: async (id: string): Promise<string> => {
        const dbResult: BlogDBModel | null  = await blogsRepository.blogs.findOne({_id: new ObjectId(id)})
        if (dbResult) return dbResult.name
        else return ""
    },

    getAllBlogs: async (): Promise<BlogViewModel[]> => {
        const dbResult: BlogDBModel[] = await blogsRepository.blogs.find({}).toArray()
        return dbResult.map(el => blogsRepository.db2View(el));
    },

    getBlogById: async (id: string): Promise<BlogViewModel | null> => {
        const dbResult: BlogDBModel | null = await blogsRepository.blogs.findOne({_id:new ObjectId(id)})
        if (dbResult) return blogsRepository.db2View(dbResult)
        return null
    },

    createBlog: async (req: RequestBody<BlogInputModel>): Promise<BlogViewModel> => {
        const newBlog: BlogDBModel = {
            _id: new ObjectId(),
            createdAt: (new Date()).toISOString(),
            isMembership: false,
            ...req.body
        }
        const res = await blogsRepository.blogs.insertOne(newBlog)
        const dbResult = await blogsRepository.blogs.findOne({_id: res.insertedId})
        return blogsRepository.db2View(dbResult!)
    },

    updateBlog: async (id: string, req: RequestBody<BlogInputModel>): Promise<boolean> => {
        const newValues = {$set: {name: req.body.name, description: req.body.description, websiteUrl: req.body.websiteUrl}}
        const dbResult = await blogsRepository.blogs.updateOne({_id: new ObjectId(id)},newValues)
        return dbResult.matchedCount === 1
    },

    deleteBlog: async (id: string): Promise<boolean> => {
        const dbResult = await blogsRepository.blogs.deleteOne({_id: new ObjectId(id)})
        return dbResult.deletedCount === 1
    }
}