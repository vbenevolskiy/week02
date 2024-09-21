import {PostInputModel, PostViewModel, RequestBody, ResponseBody} from "../types";

export type PostsModel = {
    id: number
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

export type PostsRepository = {
    posts: PostsModel[],
    getAllPosts: () => Promise<PostViewModel[]>,
    getPostById: (id: number) => Promise<PostViewModel | undefined>,
    createPost: (req: RequestBody<PostInputModel>) => Promise<PostViewModel>,
    updatePost: (id: number, req: RequestBody<PostInputModel>) => Promise<void>,
    deletePost: (id: number) => Promise<void>
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
                blogId: p.blogId,
                blogName: p.blogName
            }
        })
    },
    getPostById: async (id: number): Promise<PostViewModel | undefined> => {
        const foundPost: PostsModel | undefined = postsRepository.posts.find(p=>p.id === id)
        if (foundPost) {
            return {
                id: foundPost.id.toString(),
                title: foundPost.title,
                shortDescription: foundPost.shortDescription,
                content: foundPost.content,
                blogId: foundPost.blogId,
                blogName: foundPost.blogName,
            }
        }
    },
    createPost: async (req: RequestBody<PostInputModel>): Promise<PostViewModel> => {
        const newPost: PostsModel = {
            id: Number(new Date()),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: "",
        }
        postsRepository.posts.push(newPost)
        const result: PostViewModel = {
            id: newPost.id.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
        }
        return result
    },
    updatePost: async (id: number, req: RequestBody<PostInputModel>): Promise<void> => {

    },
    deletePost: async (id: number): Promise<void> => {

    }
}
