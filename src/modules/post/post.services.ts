import { any, date } from "better-auth/*";
import { CommentStatus, Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

// -------------- CREATE POST ---------------------------
const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }

    })
    return result
}

// ------------------ GET ALL POSTS ------------------------

const getallPost = async ({
    search,
    tags,
    isFeatured,
    page,
    limit,
    skip,
    sortBy,
    sortOder

}:
    {
        search: string | undefined,
        tags: string[] | [],
        isFeatured: boolean | undefined,
        page: number,
        limit: number,
        skip: number,
        sortBy: string,
        sortOder: string

    }) => {

    const andCondition: PostWhereInput[] = []

    if (search) {
        andCondition.push({

            OR: [
                {
                    title: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search as string
                    }
                }
            ]

        })
    }
    if (tags.length > 0) {
        andCondition.push({
            tags: {
                hasEvery: tags as string[]
            }
        })
    }
    if (typeof isFeatured === 'boolean') {
        andCondition.push({
            isFeatured
        })
    }

    const allPost = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andCondition
        },
        orderBy: {
            [sortBy]: sortOder
        },
        include: {
            _count: {
                select: { comments: true }
            }
        }

    })
    const total = await prisma.post.count({
        where: {
            AND: andCondition
        }
    })
    return {
        data: allPost,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }
}


// ------------------- GET POST BY ID --------------------
const getPostByID = async (postId: string) => {
    const result = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        const postData = await tx.post.findUnique({
            where: {
                id: postId
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: { createdAt: "desc" },
                    include: {

                        reply: {
                            orderBy: { createdAt: "asc" },
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            include: {

                                reply: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: { comments: true }
                }
            }
        })
        return postData
    })
    return result
}


// ------------------- GET MY POST DATA --------------------
const getMyPost = async (authorId: string) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE"
        },
        select: {
            id: true
        }

    })

    const result = await prisma.post.findMany({
        where: {
            authorId: authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })
    const total = await prisma.post.count({
        where: {
            authorId
        }
    })

    return {
        data: result,
        total
    }
}


// -------------- UPDATE MY POST DATA ----------------
const updateMyPost = async (postId: string, data: Partial<Post>, authorId: string,isAdmin:boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })
    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("You are not owner/creator of the post")
    }
    if(!isAdmin){
        delete data.isFeatured
    }
    const result = await prisma.post.update({
        where:{
            id:postData.id
        },
        data
    })
    return result
}

export const postServices = {
    createPost,
    getallPost,
    getPostByID,
    getMyPost,
    updateMyPost
}