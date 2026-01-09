import e, { Request, Response } from "express";
import { postServices } from "./post.services";


// ---------------- CREATE POST ---------------------------
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


// ----------------- GET ALL POST -----------------------

const getallPost = async (req:Request , res:Response)=>{
    try{ 
        const {search}=req.query
        const searchQuery = typeof  search === "string"?search:undefined
        
        const tags = req.query.tags ?(req.query.tags as string).split(",") :[]

        const result = await postServices.getallPost({search:searchQuery,tags})
        res.status(200).json(result)

    }catch(error){
         res.status(400).json({
            error: 'Post all get failed',
            details: e
        })
    }
}












export const postController = {
    createPost,
    getallPost
}