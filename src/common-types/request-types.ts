import {Request, Response} from "express";

export type RequestURI<U> = Request<U>

export type RequestURIQuery<U, Q> = Request<Partial<U>, {}, {}, Partial<Q>>

export type RequestQuery<Q> = Request<{},{},{},Partial<Q>>

export type RequestBody<B> = Request<{},{},B>

export type RequestURIBody<U, B> = Request<U, {}, B>

export type ResponseBody<B> = Response<B>