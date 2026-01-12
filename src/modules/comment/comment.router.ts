import express, { NextFunction, Request, Response } from 'express'
import { commentController } from './comment.controller'
import auth, { UserRole } from '../../middleware/auth'

const router = express.Router()

router.post("/", auth(UserRole.USER,UserRole.ADMIN), commentController.createComment)

export const commentRouter = router