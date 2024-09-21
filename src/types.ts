import {Request, Response} from "express";

export type RequestURI<U> = Request<U>
export type RequestBody<B> = Request<{},{},B>
export type RequestURIBody<U, B> = Request<U, {}, B>
export type ResponseBody<B> = Response<B>

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
}