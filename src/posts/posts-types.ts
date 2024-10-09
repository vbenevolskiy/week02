import {ObjectId} from "mongodb";
import {Paginator} from "../common-types/paginator-type";

export type PostsQueryInputModel = {
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
    blogId: string | null
}

export type PostsURIModel = {
    id: string
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

export type PostDBModel = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: ObjectId
    blogName: string
    createdAt: string
}

export type PostsPaginator= Paginator & {
    items: PostViewModel[]
}