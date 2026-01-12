import express, { NextFunction, Request, Response } from 'express'
import { commentController } from './comment.controller'
import auth, { UserRole } from '../../middleware/auth'

const router = express.Router()

router.post("/", auth(UserRole.USER,UserRole.ADMIN), commentController.createComment)

router.get("/:commentId",  commentController.getCommentByID)
router.get("/author/:authorId",  commentController.getCommentByAuthor)
router.delete("/:commentId",auth(UserRole.USER,UserRole.ADMIN),commentController.deleteComment)
router.patch("/:commentId",auth(UserRole.USER,UserRole.ADMIN),commentController.updateComment)
router.patch("/:commentId/moderate",auth(UserRole.ADMIN),commentController.moderateComment)

export const commentRouter = router