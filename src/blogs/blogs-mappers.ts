import {BlogDBModel, BlogViewModel} from "./blogs-types";

export const blogDBToBlogViewMapper = (blog: BlogDBModel): BlogViewModel => {
   return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership
   }
}