import express, { NextFunction, Request, Response } from 'express'
import { postController } from './post.controller'
import auth, { UserRole } from '../../middleware/auth'
const router = express.Router()


router.post("/", auth(UserRole.USER,UserRole.ADMIN), postController.createPost)
router.get("/my-posts",auth(UserRole.USER,UserRole.ADMIN),postController.getMyPost)
router.get("/", postController.getallPost)
router.get("/:postId",postController.getPostById)


export const postRouter = router
