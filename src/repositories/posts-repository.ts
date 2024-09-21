import {PostInputModel, PostViewModel, RequestBody} from "../types"
import {blogsRepository} from "./blogs-repository";

export type PostModel = {
    id: number
    title: string
    shortDescription: string
    content: string
    blogId: number
    blogName: string
}

export type PostsRepository = {
    posts: PostModel[],
    getAllPosts: () => Promise<PostViewModel[]>,
    getPostById: (id: number) => Promise<PostViewModel | undefined>,
    createPost: (req: RequestBody<PostInputModel>) => Promise<PostViewModel>,
    updatePost: (id: number, req: RequestBody<PostInputModel>) => Promise<boolean>,
    deletePost: (id: number) => Promise<boolean>
}


export const postsRepository:PostsRepository = {
    posts: [],
    getAllPosts: async (): Promise<PostViewModel[]> => {
        return postsRepository.posts.map(p =>{
            return {
                id: p.id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId.toString(),
                blogName: p.blogName
            }
        })
    },
    getPostById: async (id: number): Promise<PostViewModel | undefined> => {
        const foundPost: PostModel | undefined = postsRepository.posts.find(p=>p.id === id)
        if (foundPost) {
            return {
                id: foundPost.id.toString(),
                title: foundPost.title,
                shortDescription: foundPost.shortDescription,
                content: foundPost.content,
                blogId: foundPost.blogId.toString(),
                blogName: foundPost.blogName,
            }
        }
    },
    createPost: async (req: RequestBody<PostInputModel>): Promise<PostViewModel> => {
        const newPost: PostModel = {
            id: Number(new Date()),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: Number(req.body.blogId),
            blogName: await blogsRepository.getBlogNameById(Number(req.body.blogId)),
        }
        postsRepository.posts.push(newPost)
        return {
            id: newPost.id.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId.toString(),
            blogName: newPost.blogName,
        }
    },
    updatePost: async (id: number, req: RequestBody<PostInputModel>): Promise<boolean> => {
        const foundPost: PostModel | undefined = postsRepository.posts.find(p=>p.id === id)
        if (foundPost) {
            if (req.body.title) foundPost.title = req.body.title
            if (req.body.shortDescription) foundPost.shortDescription = req.body.shortDescription
            if (req.body.content) foundPost.content = req.body.content
            if (req.body.blogId) foundPost.blogId = Number(req.body.blogId)
            return true
        }
        return false
    },
    deletePost: async (id: number): Promise<boolean> => {
        for (let i=0; i<postsRepository.posts.length; i++) {
            if (postsRepository.posts[i].id === id)  {
                postsRepository.posts.splice(i, 1)
                return true
            }
        }
        return false
    }
}
