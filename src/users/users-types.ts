import {Paginator} from "../common-types/paginator-type"
import {ObjectId} from "mongodb";

export type UsersURIParams = {
    id: string
}

export type UserInputModel = {
    login: string
    password: string
    email: string
}

export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UserDBModel = {
    _id: ObjectId
    login: string
    email: string
    salt: string
    pwdHash: string
    createdAt: string

}

export type UsersQueryInputModel = {
    searchLoginTerm: string | null
    searchEmailTerm: string | null
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
}

export type UsersPaginator = Paginator & {
    items: UserViewModel[]
}

