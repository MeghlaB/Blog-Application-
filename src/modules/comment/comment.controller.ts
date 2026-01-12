import { Request, Response } from "express"
import { commentServices } from "./comment.servicess"

// ---------------- CREATE COMMENT ---------------------------
const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user
        req.body.authorId = user?.id
        console.log(user)
        const result = await commentServices.createComment(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({
            error: 'Post creation failed',
            details: error

        })
    }
}


// ---------------- GET  COMMENT  BY ID ---------------------------
const getCommentByID = async (req: Request, res: Response) => {
    try {

        const { commentId } = req.params
        const result = await commentServices.getCommentByID(commentId as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            error: 'comments fetch BY id  failed',
            details: error

        })
    }
}


// ---------------- GET  COMMENT  BY AUTHOR  ID ---------------------------

const getCommentByAuthor = async (req: Request, res: Response) => {
    try {

        const { authorId } = req.params
        const result = await commentServices.getCommentByAuthor(authorId as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            error: 'comments fetch  failed',
            details: error

        })
    }
}

export const commentController = {
    createComment,
    getCommentByID,
    getCommentByAuthor
}