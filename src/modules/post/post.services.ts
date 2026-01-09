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

const getallPost = async ({ search, tags }:
    {
        search: string | undefined,
        tags: string[] | []

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