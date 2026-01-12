import { Request, Response } from "express"
import { commentServices } from "./comment.servicess"

// ---------------- CREATE COMMENT ---------------------------
const createComment = async (req: Request, res: Response) => {
    try {
      const user = req.user
      req.body.authorId= user?.id
      console.log(user)
        const result = await commentServices.createComment(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({
            error: 'Post creation failed',
            details:error
            
        })
    }
}


export const commentController ={
    createComment
}