import e, { Request, Response } from "express";
import { postServices } from "./post.services";
import paginationHelpers from "../../hlepers/paginationHelpers";
import { UserRole } from "../../middleware/auth";


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

const getallPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const searchQuery = typeof search === "string" ? search : undefined

        const tags = req.query.tags ? (req.query.tags as string).split(",") : []
        const isFeatured = req.query.isFeatured ? req.query.isFeatured === "true" : undefined


        //  pagination


        const { page, limit, skip, sortBy, sortOder } = paginationHelpers(req.query)


        const result = await postServices.getallPost({ search: searchQuery, tags, isFeatured, page, limit, skip, sortBy, sortOder })
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json({
            error: 'Post all get failed',
            details: e
        })
    }
}

// ------------------ GET BY ID ---------------

const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params
        if (!postId) {
            throw new Error("Post Id is Required!")
        }
        const result = await postServices.getPostByID(postId)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            error: 'Post all get failed',
            details: e
        })
    }
}


// ------------------- GET MY POST DATA --------------------
const getMyPost = async (req: Request, res: Response) => {
    try {
        const user = req.user
       
        if(!user){
            throw new Error("You are unauthorized")
        }     
        const result = await postServices.getMyPost(user?.id as string)
     
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            error: 'MY POST INVALID',
          
        })
    }
}


// -------------- UPDATE MY POST DATA ----------------

const   updateMyPost = async (req: Request, res: Response) => {
    try {
        const user = req.user
       
        if(!user){
            throw new Error("You are unauthorized")
        }     
        const {postId}=req.params
       console.log(user)
        const isAdmin = user.role === UserRole.ADMIN
     
        const result = await postServices.updateMyPost( postId as string , req.body , user?.id as string,isAdmin )
     
        res.status(200).json(result)
    } catch (error) {
         const errorMessage = (error instanceof Error) ? error.message : 'Update Post Failed'
        res.status(400).json({
            error: errorMessage,
          
        })
    }
}

// -------------- DELETE POST DATA ----------------

const   deletePost = async (req: Request, res: Response) => {
    try {
        const user = req.user
       
        if(!user){
            throw new Error("You are unauthorized")
        }     
        const {postId}=req.params
       console.log(user)
        const isAdmin = user.role === UserRole.ADMIN
     
        const result = await postServices.deletePost( postId as string ,  user?.id as string,isAdmin )
     
        res.status(200).json(result)
    } catch (error) {
         const errorMessage = (error instanceof Error) ? error.message : 'Delete Post Failed'
        res.status(400).json({
            error: errorMessage,
          
        })
    }
}

// ----------------- GET STATS -----------------------------

const   getStats = async (req: Request, res: Response) => {
    try {
       
     
        const result = await postServices.getStats(  )
     
        res.status(200).json(result)
    } catch (error) {
         const errorMessage = (error instanceof Error) ? error.message : 'Stats fetched Failed'
        res.status(400).json({
            error: errorMessage,
          
        })
    }
}

export const postController = {
    createPost,
    getallPost,
    getPostById,
    getMyPost,
    updateMyPost,
      deletePost,
      getStats
}