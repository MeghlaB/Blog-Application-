import { Request, Response } from "express"
import { commentServices } from "./comment.servicess"
import strict from "node:assert/strict"
import { date } from "better-auth/*"

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

// ---------------- DELETE COMMENT  ---------------------------

const deleteComment = async (req: Request, res: Response) => {
    try {

        const user = req.user
        const { commentId } = req.params
        const result = await commentServices.deleteComment(commentId as string, user?.id as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            error: 'comments delete  failed',
            details: error

        })
    }
}

// -------------- UPDATE COMMENT --------------------
const updateComment = async (req: Request, res: Response) => {
    try {

        const user = req.user
        const { commentId } = req.params
        const result = await commentServices.updateComment(user?.id as string, commentId as string, req.body)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            error: 'comments patch  failed',
            details: error

        })
    }
}

// -------------- MODARATE COMMENT --------------------
const moderateComment = async (req: Request, res: Response) => {
    try {

        const { commentId } = req.params
        const result = await commentServices.moderateComment(commentId as string, req.body)
        res.status(200).json(result)
    } catch (error) {

        const errorMessage = (error instanceof Error) ? error.message : 'comments patch  failed'
        res.status(400).json({
            error: errorMessage,
            details: error

        })
    }
}



export const commentController = {
    createComment,
    getCommentByID,
    getCommentByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}