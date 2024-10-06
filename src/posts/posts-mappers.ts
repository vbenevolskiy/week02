import {PostDBModel, PostViewModel} from "./posts-types";

export const postDBToPostViewMapper = (post: PostDBModel):PostViewModel => {
   return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt
   }
}