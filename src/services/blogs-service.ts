import {BlogDBModel, BlogInputModel, BlogViewModel, RequestBody} from "../types";
import {ObjectId} from 'mongodb'
import {blogsRepository} from "../repositories/blogs-db-repository";

export type BlogsService = {
    mapDBToView: (record: BlogDBModel) => BlogViewModel
    isValidBlogId: (id: string) => Promise<boolean>,
    getBlogNameById: (id: string) => Promise<string | null>,
    getAllBlogs: () => Promise<BlogViewModel[]>,
    getBlogById: (id: string) => Promise<BlogViewModel | null>,
    createBlog: (req: RequestBody<BlogInputModel>) => Promise<BlogViewModel>,
    updateBlog: (id: string, req: RequestBody<BlogInputModel>) => Promise<boolean>,
    deleteBlog: (id: string) => Promise<boolean>
}

export const blogsService: BlogsService = {

    mapDBToView: (record: BlogDBModel): BlogViewModel => {
        return {
            id: record._id.toString(),
            name: record.name,
            description: record.description,
            websiteUrl: record.websiteUrl,
            createdAt: record.createdAt,
            isMembership: record.isMembership
        }
    },

    isValidBlogId: async (id: string): Promise<boolean> => {
        return blogsRepository.isValidBlogId(new ObjectId(id))
    },

    getBlogNameById: async (id: string): Promise<string | null> => {
        return blogsRepository.getBlogNameById(new ObjectId(id))
    },

    getAllBlogs: async (): Promise<BlogViewModel[]> => {
        const dbResult: BlogDBModel[] = await blogsRepository.getAllBlogs()
        return dbResult.map(record => blogsService.mapDBToView(record));
    },

    getBlogById: async (id: string): Promise<BlogViewModel | null> => {
        const dbResult: BlogDBModel | null = await blogsRepository.getBlogById(new ObjectId(id))
        return dbResult ? blogsService.mapDBToView(dbResult) : null
    },

    createBlog: async (req: RequestBody<BlogInputModel>): Promise<BlogViewModel> => {
        const newBlog: BlogDBModel = {
            _id: new ObjectId(),
            createdAt: (new Date()).toISOString(),
            isMembership: false,
            ...req.body
        }
        const newBlogId = await blogsRepository.createBlog(newBlog)
        const result = await blogsRepository.getBlogById(newBlogId)
        return blogsService.mapDBToView(result!)
    },

    updateBlog: async (id: string, req: RequestBody<BlogInputModel>): Promise<boolean> => {
        return blogsRepository.updateBlog(new ObjectId(id), req.body)
    },

    deleteBlog: async (id: string): Promise<boolean> => {
        return blogsRepository.deleteBlog(new ObjectId(id))
    }
}