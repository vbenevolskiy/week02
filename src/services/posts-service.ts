import {
    PostDBModel,
    PostInputModel, PostsPaginator,
    PostsQueryInputModel,
    PostsQueryOptions, PostsURIModel,
    PostViewModel,
    RequestBody, RequestURIBody, RequestURIQuery
} from "../types"
import {blogsService} from "./blogs-service";
import {postsRepository} from "../repositories/posts-db-repository";
import {ObjectId} from "mongodb";

export type PostsService = {
    postsQueryOptionsFactory: (req:RequestURIQuery<PostsURIModel, PostsQueryInputModel>) => PostsQueryOptions
    mapDBToView: (record:PostDBModel) => PostViewModel,
    getAllPosts: (queryConfig: RequestURIQuery<PostsURIModel, PostsQueryInputModel>) => Promise<PostsPaginator>,
    getPostById: (id: string) => Promise<PostViewModel | null>,
    createPost: (req: RequestBody<PostInputModel>) => Promise<PostViewModel>,
    createPostWithID: (req: RequestURIBody<PostsURIModel, PostInputModel>) => Promise<PostViewModel>,
    updatePost: (id: string, req: RequestBody<PostInputModel>) => Promise<boolean>,
    deletePost: (id: string) => Promise<boolean>
}

export const postsService:PostsService = {

    postsQueryOptionsFactory: (req:RequestURIQuery<PostsURIModel, PostsQueryInputModel>): PostsQueryOptions => {
        const searchFilter = req.params.id ? {blogId: new ObjectId(req.params.id)} : {}
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        return {
            searchFilter: searchFilter,
            sortFilter: sortDirection === 'desc' ? {[sortBy]: -1} : {[sortBy]: 1},
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
            pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1
        }
    },

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

    getAllPosts: async (req:RequestURIQuery<PostsURIModel, PostsQueryInputModel>): Promise<PostsPaginator> => {
        const postsQueryOptions = postsService.postsQueryOptionsFactory(req)
        const totalCount: number = await postsRepository.getTotalCount(postsQueryOptions.searchFilter)
        const dbResult: PostDBModel[] = await postsRepository.getAllPosts(postsQueryOptions)
        console.log(dbResult)
        return {
            pagesCount: Math.ceil(totalCount / postsQueryOptions.pageSize),
            page: postsQueryOptions.pageNumber,
            pageSize: postsQueryOptions.pageSize,
            totalCount: totalCount,
            items: dbResult.map(record => postsService.mapDBToView(record))
        }
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

    createPostWithID: async (req: RequestURIBody<PostsURIModel, PostInputModel>): Promise<PostViewModel> => {
        console.log(`req.body: ${req.body}`)
        console.log(`id: ${req.params.id}`)
        // @ts-ignore
        const blogName: string = await blogsService.getBlogNameById(req.params.id)
        const newPost: PostDBModel = {
            _id: new ObjectId(),
            blogName: blogName,
            createdAt: (new Date()).toISOString(),
            ...req.body,
            blogId: new ObjectId(req.params.id),
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
