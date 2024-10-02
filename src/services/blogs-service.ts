import {
    BlogDBModel,
    BlogInputModel,
    BlogsPaginator,
    BlogsQueryInputModel,
    BlogsQueryOptions, BlogsURIModel,
    BlogViewModel,
    RequestBody, RequestURIQuery
} from "../types";
import {ObjectId} from 'mongodb'
import {blogsRepository} from "../repositories/blogs-db-repository";

export type BlogsService = {
    blogsQueryOptionsFactory: (req: RequestURIQuery<BlogsURIModel, BlogsQueryInputModel>) => BlogsQueryOptions
    mapDBToView: (record: BlogDBModel) => BlogViewModel
    isValidBlogId: (id: string) => Promise<boolean>,
    getBlogNameById: (id: string) => Promise<string | null>,
    getAllBlogs: (req: RequestURIQuery<BlogsURIModel, BlogsQueryInputModel>) => Promise<BlogsPaginator>,
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

    blogsQueryOptionsFactory: (req: RequestURIQuery<BlogsURIModel, BlogsQueryInputModel>): BlogsQueryOptions => {
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        const idTerm: string = req.params.id ? req.params.id : ""
        const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm : null
        let filter = {}
        if (idTerm && searchNameTerm) filter = {'$regex': searchNameTerm, _id: new ObjectId(idTerm), '$options': 'i'}
        else if (idTerm && !searchNameTerm) filter = {_id: new ObjectId(idTerm)}
        else if (searchNameTerm && !idTerm) filter = {'$regex': searchNameTerm, '$options': 'i'}
        return {
            searchFilter: filter,
            sortFilter: sortDirection === 'desc' ? {[sortBy]: -1} : {[sortBy]: 1},
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
            pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1
        }
    },

    isValidBlogId: async (id: string): Promise<boolean> => {
        return await blogsRepository.isValidBlogId(new ObjectId(id))
    },

    getBlogNameById: async (id: string): Promise<string | null> => {
        return blogsRepository.getBlogNameById(new ObjectId(id))
    },

    getAllBlogs: async (req: RequestURIQuery<BlogsURIModel, BlogsQueryInputModel>): Promise<BlogsPaginator> => {
        const blogsQueryOptions = blogsService.blogsQueryOptionsFactory(req)
        const totalCount: number = await blogsRepository.getTotalCount(blogsQueryOptions.searchFilter)
        const dbResult: BlogDBModel[] = await blogsRepository.getAllBlogs(blogsQueryOptions)
        return {
            pagesCount: Math.ceil(totalCount / blogsQueryOptions.pageSize),
            page: blogsQueryOptions.pageNumber,
            pageSize: blogsQueryOptions.pageSize,
            totalCount: totalCount,
            items: dbResult.map(record => blogsService.mapDBToView(record))
        }
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