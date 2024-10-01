import {Request, Response} from "express";
import {ObjectId} from "mongodb";

export type RequestURI<U> = Request<U>

export type RequestBody<B> = Request<{},{},B>

export type RequestURIBody<U, B> = Request<U, {}, B>

export type ResponseBody<B> = Response<B>

export type BlogsQueryModel = {
    id: string
}

export type PostsQueryModel = {
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