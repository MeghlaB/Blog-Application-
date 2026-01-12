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

// ---------------- DELETE COMMENT  ---------------------------

const deleteComment = async(commentId:string , authorId:string)=>{
  const commentData = await prisma.comment.findFirst({
    where:{
        id:commentId,
        authorId
    },
    select:{
        id:true
    }
  })

  if(!commentData){
    throw new Error ("Your provided input is invalid!..")
  }

  return await prisma.comment.delete({
    where:{
        id:commentData.id
    }
  })

}

//  -------------------- UPDATE COMMENT __________
const updateComment = async(authorId:string ,commentId:string , data:{content?:string,status?:CommentStatus})=>{

  const commentData = await prisma.comment.findFirst({
    where:{
        id:commentId,
        authorId
    },
    select:{
        id:true
    }
  })

  if(!commentData){
    throw new Error ("Your provided input is invalid!..")
  }

return await prisma.comment.update({
    where:{
        id:commentId,
        authorId
    },
    data
})
}

// ---------------- MODARATE COMMENT---------------------
const moderateComment=async(commentId:string,data:{status:CommentStatus})=>{
 const commentData=   await prisma.comment.findUniqueOrThrow({
        where:{
            id:commentId
        }
        
    })

    if(commentData.status === data.status){
        throw new Error (`Your provided status (${data.status}) is already up to date.`)
    }



  return await prisma.comment.update({
    where:{
        id:commentId
    },
    data
  })
}







export const commentServices = {
    createComment,
    getCommentByID,
    getCommentByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}