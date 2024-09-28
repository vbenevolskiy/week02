import {BlogInputModel, BlogViewModel, RequestBody} from "../types";
import {dbClient} from "./db";

export type BlogModel = {
    id: number,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogsRepository = {
    blogs: BlogModel[],
    isValidBlogId: (id: number) => Promise<boolean>,
    getBlogNameById: (id: number) => Promise<string>,
    getAllBlogs: () => Promise<BlogViewModel[]>,
    getBlogById: (id: number) => Promise<BlogViewModel | undefined>,
    createBlog: (req: RequestBody<BlogInputModel>) => Promise<BlogViewModel>,
    updateBlog: (id: number, req: RequestBody<BlogInputModel>) => Promise<boolean>,
    deleteBlog: (id: number) => Promise<boolean>
}

export const blogsRepository: BlogsRepository = {
    blogs: [],

    isValidBlogId: async (id: number): Promise<boolean> => {
        const result = await blogsRepository.getBlogById(id);
        if (!result) return false
        else return true
    },

    getBlogNameById: async (id: number): Promise<string> => {
        return blogsRepository.blogs.find(b => b.id === id)?.name || ""
    },

    getAllBlogs: async (): Promise<BlogViewModel[]> => {
        const result =  blogsRepository.blogs.map(b =>{
            return {
                id: b.id.toString(),
                name: b.name,
                description: b.description,
                websiteUrl: b.websiteUrl,
                createdAt: b.createdAt,
                isMembership: b.isMembership
            }
        })
        console.log(result)
        return result
    },

    getBlogById: async (id: number): Promise<BlogViewModel | undefined> => {
        const foundBlog: BlogModel | undefined = blogsRepository.blogs.find(b=>b.id === id)
        if (foundBlog) {
            return {
                id: foundBlog.id.toString(),
                name: foundBlog.name,
                description: foundBlog.description,
                websiteUrl: foundBlog.websiteUrl,
                createdAt: foundBlog.createdAt,
                isMembership: foundBlog.isMembership
            }
        }
    },

    createBlog: async (req: RequestBody<BlogInputModel>): Promise<BlogViewModel> => {
        const now = new Date();
        const newBlog: BlogModel = {
            id: Number(now),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: now.toISOString(),
            isMembership: false
        }
        blogsRepository.blogs.push(newBlog)
        return {
            id: newBlog.id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },

    updateBlog: async (id: number, req: RequestBody<BlogInputModel>): Promise<boolean> => {
        const foundBlog: BlogModel | undefined = blogsRepository.blogs.find(b=>b.id === id)
        if (foundBlog) {
            if (req.body.name) foundBlog.name = req.body.name
            if (req.body.description) foundBlog.description = req.body.description
            if (req.body.websiteUrl) foundBlog.websiteUrl = req.body.websiteUrl
            return true
        }
        return false
    },

    deleteBlog: async (id: number): Promise<boolean> => {
        for (let i=0; i<blogsRepository.blogs.length; i++) {
            if (blogsRepository.blogs[i].id === id)  {
                blogsRepository.blogs.splice(i, 1)
                return true
            }
        }
        return false
    }
}