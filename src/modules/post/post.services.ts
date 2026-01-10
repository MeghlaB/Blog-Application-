import { Post } from "../../../generated/prisma/client";
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

const getallPost = async ({ search, tags, isFeatured,page,limit }:
    {
        search: string | undefined,
        tags: string[] | [],
        isFeatured: boolean |undefined,
        page:number,
        limit:number

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
        where: {
            AND: andCondition
        }
    })
    return allPost
}






export const postServices = {
    createPost,
    getallPost
}