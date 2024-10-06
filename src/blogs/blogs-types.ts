import {ObjectId, Sort} from "mongodb";
import {Paginator} from "../common-types/paginator-type";

export type BlogsURIModel = {
    id: string
}

export type BlogsQueryInputModel = {
    id: string
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

export type BlogDBModel = {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogsPaginator = Paginator & {
    items: BlogViewModel[]
}