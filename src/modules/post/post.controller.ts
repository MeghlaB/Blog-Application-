import e, { Request, Response } from "express";
import { postServices } from "./post.services";

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(400).json({
                error: 'Unauthorized',

            })
        }
        const result = await postServices.createPost(req.body, user.id as string)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({
            error: 'Post creation failed',
            details: e
        })
    }
}

export const postController = {
    createPost
}