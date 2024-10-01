import {PostDBModel, PostInputModel, PostViewModel, RequestBody} from "../types"
import {blogsService} from "./blogs-service";
import {postsRepository} from "../repositories/posts-db-repository";
import {ObjectId} from "mongodb";

export type PostsService = {
    mapDBToView: (record:PostDBModel) => PostViewModel,
    getAllPosts: () => Promise<PostViewModel[]>,
    getPostById: (id: string) => Promise<PostViewModel | null>,
    createPost: (req: RequestBody<PostInputModel>) => Promise<PostViewModel>,
    updatePost: (id: string, req: RequestBody<PostInputModel>) => Promise<boolean>,
    deletePost: (id: string) => Promise<boolean>
}


export const postsService:PostsService = {

    mapDBToView: (record: PostDBModel):PostViewModel => {
        return {
            id: record._id.toString(),
            title: record.title,
            shortDescription: record.shortDescription,
            content: record.content,
            blogId: record.blogId.toString(),
            blogName: record.blogName,
            createdAt: record.createdAt
        }
    },

    getAllPosts: async (): Promise<PostViewModel[]> => {
        const dbResult: PostDBModel[] = await postsRepository.getAllPosts()
        return dbResult.map(record => postsService.mapDBToView(record));
    },

    getPostById: async (id: string): Promise<PostViewModel | null> => {
        const dbResult: PostDBModel | null = await postsRepository.getPostById(new ObjectId(id))
        return dbResult ? postsService.mapDBToView(dbResult) : null;
    },

    createPost: async (req: RequestBody<PostInputModel>): Promise<PostViewModel> => {
        // @ts-ignore
        const blogName: string = await blogsService.getBlogNameById(req.body.blogId)
        const newPost: PostDBModel = {
            _id: new ObjectId(),
            blogName: blogName,
            createdAt: (new Date()).toISOString(),
            ...req.body,
            blogId: new ObjectId(req.body.blogId),
        }
        const newPostID = await postsRepository.createPost(newPost)
        const result = await postsRepository.getPostById(newPostID)
        return postsService.mapDBToView(result!)
    },

    updatePost: async (id: string, req: RequestBody<PostInputModel>): Promise<boolean> => {
        // @ts-ignore
        const blogName: string = await blogsService.getBlogNameById(req.body.blogId)
        const newValues: Partial<PostDBModel> = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: new ObjectId(req.body.blogId),
            blogName: blogName
        }
        return postsRepository.updatePost(new ObjectId(id), newValues)
    },

    deletePost: async (id: string): Promise<boolean> => {
        return postsRepository.deletePost(new ObjectId(id))
    }
}
