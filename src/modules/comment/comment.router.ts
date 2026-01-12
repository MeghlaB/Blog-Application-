import express, { NextFunction, Request, Response } from 'express'
import { commentController } from './comment.controller'
import auth, { UserRole } from '../../middleware/auth'

const router = express.Router()

router.post("/", auth(UserRole.USER,UserRole.ADMIN), commentController.createComment)

router.get("/:commentId",  commentController.getCommentByID)
router.get("/author/:authorId",  commentController.getCommentByAuthor)

export const commentRouter = router