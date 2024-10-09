import {Router, Response} from "express";
import {RequestURI, RequestURIBody, ResponseBody} from "../common-types/request-types";
import {CommentInputModel, CommentURIModel, CommentViewModel} from "./comments-types";
import {commentsService} from "./comments-service";
import {commentsDeleteMiddleware, commentsPutMiddleware} from "./comments-middleware/comments-middleware";

export const commentsRouter = Router()

commentsRouter.get('/:id',
   async (req:RequestURI<CommentURIModel>, res:ResponseBody<CommentViewModel>) => {
   const comment = await commentsService.getCommentById(req.params.id)
   if (!comment) res.sendStatus(404)
   res.status(200).json(comment!)
})

commentsRouter.put('/:id',
   commentsPutMiddleware,
   async (req:RequestURIBody<CommentURIModel, CommentInputModel>, res: Response)=>{
      const comment = await commentsService.getCommentById(req.params.id)
      if (!comment) return res.sendStatus(404)
      if (comment.commentatorInfo.userId !== req.headers.userId) return res.sendStatus(403)
      const updateResult = await commentsService.updateComment(req.params.id, comment)
      updateResult ? res.sendStatus(204) : res.sendStatus(404)
})

commentsRouter.delete('/:id',
   commentsDeleteMiddleware,
   async (req:RequestURI<CommentURIModel>, res:Response)=>{
      const comment = await commentsService.getCommentById(req.params.id)
      if (!comment) return res.sendStatus(404)
      if (comment.commentatorInfo.userId !== req.headers.userId) return res.sendStatus(403)
      const deleteResult = await commentsService.deleteComment(req.params.id)
      deleteResult ? res.sendStatus(204) : res.sendStatus(404)
})