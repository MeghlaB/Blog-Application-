import { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"



// ---------------- CREATE COMMENT ---------------------------
const createComment = async (payload: {
    content: string,
    authorId: string
    postId: string,
    parentId?: string
}) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }



    return await prisma.comment.create({
        data: payload

    })



}


// ---------------- GET  COMMENT  BY ID ---------------------------
const getCommentByID = async (commentId: string) => {
    return await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,

                }
            }
        }
    })
}

// ---------------- GET  COMMENT  BY AUTHOR ID ---------------------------
const getCommentByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt:'desc'
        },
        include:{
            post:{
               select:{
                id:true,
                title:true
               }
            }
        }

    })
}
export const commentServices = {
    createComment,
    getCommentByID,
    getCommentByAuthor
}