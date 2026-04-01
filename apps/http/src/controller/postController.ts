import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createPost = async (req: Request, res: Response) => {
    console.log("Request for creating post");
    const { content, tags } = req.body;
    console.log(content, tags);
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!content || content.trim().length === 0) { return res.json({ message: "Empty content" }) };
    try {
        const post = await prisma.post.create({
            data: { userId: req.user.userId, content, tags }
        })
        if (!post) { return res.status(400).json({ message: "Post can't be created" }) };
        return res.status(201).json({ message: "Post created Successfully", post });
    }
    catch (e) {
        return res.status(400).json({ message: "Error", error: e })
    }

}

export const postComment = async (req: Request, res: Response) => {
    const { postId, content } = req.body;
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(postId, content);
    try {
        const comment = await prisma.comment.create({
            data: { postId, userId: req.user.userId, content }
        })
        await prisma.post.update({
            where: { id: postId },
            data: {
                commentsCount: { increment: 1 },
            },
        });
        if (!comment) return res.status(400).json({ message: "Can't add comment" });
        return res.status(200).json({ message: "successfully commented" });
    }
    catch (e) {
        return res.status(400).json({ message: "error in comments", error: e })
    }


}

export const fetchComment = async (req: Request, res: Response) => {
    const { postId } = req.body;
    if (!postId) return res.json({ message: "No post id given" });
    try {
        const comments = await prisma.post.findUnique({
            where: {
                id: postId
            },

            include: { comments: true },
        })
        if (!comments) return res.status(400).json({ message: "No comment found" });
        return res.status(201).json({ comments });
    }
    catch (e) {
        return res.status(400).json({ message: "Error found", error: e })
    }

}

export const fetchPosts = async (req: Request, res: Response) => {
    console.log("fetching posts");
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        res.status(200).json({ posts });
    }
    catch (e) {
        return res.status(400).json({ message: "error in fetching posts" });
    }
}