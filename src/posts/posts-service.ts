import {PostDBModel, PostInputModel, PostViewModel} from "./posts-types";
import {postsRepo} from "./posts-repositories/posts-repo";
import {blogsService} from "../blogs/blogs-service";
import {ObjectId} from "mongodb";
import {postDBToPostViewMapper} from "./posts-mappers";

export type PostsService = {
    getPostById: (id: string) => Promise<PostViewModel | null>,
    createPost: (post: PostInputModel) => Promise<PostViewModel>,
    updatePost: (id: string, post: PostInputModel) => Promise<boolean>,
    deletePost: (id: string) => Promise<boolean>
}

export const postsService:PostsService = {

    getPostById: async (id: string): Promise<PostViewModel | null> => {
        return postsRepo.getPostById(new ObjectId(id));
    },

    createPost: async (post: PostInputModel): Promise<PostViewModel> => {
        // @ts-ignore
        const blogName: string = await blogsService.getBlogNameById(req.body.blogId)
        const newPost: PostDBModel = {
            _id: new ObjectId(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: new ObjectId(post.blogId),
            blogName: blogName,
            createdAt: new Date().toISOString()
        }
        const newPostID = await postsRepo.createPost(newPost)
        //@ts-ignore
        return postsRepo.getPostById(newPostID)
    },

    updatePost: async (id: string, post: PostInputModel): Promise<boolean> => {
        // @ts-ignore
        const blogName: string = await blogsService.getBlogNameById(req.body.blogId)
        const newValues: Partial<PostDBModel> = {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: new ObjectId(post.blogId),
            blogName: blogName
        }
        return postsRepo.updatePost(new ObjectId(id), newValues)
    },

    deletePost: async (id: string): Promise<boolean> => {
        return postsRepo.deletePost(new ObjectId(id))
    }
}
