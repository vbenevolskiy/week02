import {Request, Response} from "express";
import {ObjectId, Sort} from "mongodb";

export type RequestURI<U> = Request<U>

export type RequestURIQuery<U, Q> = Request<Partial<U>, Partial<Q>>

export type RequestBody<B> = Request<{},{},B>

export type RequestURIBody<U, B> = Request<U, {}, B>

export type ResponseBody<B> = Response<B>

export type BlogsURIModel = {
    id: string
}

export type BlogsQueryInputModel = {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
}

export type BlogsQueryOptions = {
    searchFilter: Object
    sortFilter: Sort,
    pageNumber: number
    pageSize: number
}

export type PostsQueryInputModel = {
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
}

export type PostsQueryOptions = {
    searchFilter: Object
    sortFilter: Sort
    pageNumber: number
    pageSize: number
}

export type PostsURIModel = {
    id: string
}

export type FieldError = {
    message: string
    field: string
}

export type APIErrorResult = {
    errorsMessages: FieldError[]
}

export type BlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type BlogDBModel = {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PostDBModel = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: ObjectId
    blogName: string
    createdAt: string
}

export type BlogsPaginator= {
    pagesCount:	number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModel[]
}

export type PostsPaginator= {
    pagesCount:	number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewModel[]
}