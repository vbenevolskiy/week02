import {
    BlogDBModel,
    BlogInputModel,
    BlogViewModel
} from "./blogs-types";
import {ObjectId} from 'mongodb'
import {blogsRepo} from "./blogs-repositories/blogs-repo";

export type BlogsService = {
    isValidBlogId: (id: string) => Promise<boolean>,
    getBlogNameById: (id: string) => Promise<string | null>,
    getBlogById: (id: string) => Promise<BlogViewModel | null>,
    createBlog: (blog: BlogInputModel) => Promise<BlogViewModel>,
    updateBlog: (id: string, blog:BlogInputModel) => Promise<boolean>,
    deleteBlog: (id: string) => Promise<boolean>
}

export const blogsService: BlogsService = {

    isValidBlogId: async (id: string): Promise<boolean> => {
        return await blogsRepo.isValidBlogId(new ObjectId(id))
    },

    getBlogNameById: async (id: string): Promise<string | null> => {
        return blogsRepo.getBlogNameById(new ObjectId(id))
    },

    getBlogById: async (id: string): Promise<BlogViewModel | null> => {
        return await blogsRepo.getBlogById(new ObjectId(id))
    },

    createBlog: async (blog: BlogInputModel): Promise<BlogViewModel> => {
        const newBlog: BlogDBModel = {
            _id: new ObjectId(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const newBlogId = await blogsRepo.createBlog(newBlog)
        //@ts-ignore
        return blogsRepo.getBlogById(newBlogId)
    },

    updateBlog: async (id: string, blog: BlogInputModel): Promise<boolean> => {
        const newBlog: Partial<BlogDBModel> = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        }
        return blogsRepo.updateBlog(new ObjectId(id), newBlog)
    },

    deleteBlog: async (id: string): Promise<boolean> => {
        return blogsRepo.deleteBlog(new ObjectId(id))
    }
}