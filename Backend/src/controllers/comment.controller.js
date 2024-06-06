import mongoose, { isValidObjectId, mongo } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const addComment = asyncHandler(async (req, res) =>{
    const videoId = req.params
    const content = req.body

    if(!videoId){
        throw new ApiError(400, "Missing videoId")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video doesn't exist");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    })

    const createdComment = await Comment.findById(comment._id)

    if(!createdComment){
        throw new ApiError(500, "Something went wrong while adding the comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdComment, "Comment added to the video successfully")
    )
})

const getVideoComments = asyncHandler(async (req, res) =>{
    /**
     * fetch the videoId from params and page no. and limit from the query
     * checks and validations
     * aggregation pipeline to populate the video model with the comment documents where video as videoId
     */

    const videoId = req.params
    let {page = 1, limit = 10} = req.query  // default if explicitly not provided

    page = Number(page)
    limit = Number(page)

    if(!videoId){
        throw new ApiError(400, "Missing video id")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(401, "Invalid video Id");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video doesn't exist");
    }

    const commentList = await Comment.find({video: videoId})
    .skip((page-1) * limit)
    .limit(limit)
    .populate("video")
    .populate({
        path: "owner",
        select: "username fullName avatar email"
    })

    if(!commentList){
        throw new ApiError(500, "Something went wrong while fetching the comments")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, commentList, "Comments fetched successfully")
    )
})

const updateComment = asyncHandler(async (req, res) =>{
    const {content} = req.body;
    const {commentId} = req.params;

    if(!commentId){
        throw new ApiError(400, "Missing comment Id")
    }

    if(!content){
        throw new ApiError(400, "Missing content")
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment Id")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "Comment doesn't exist");
    }

    if(comment.owner?.toString() !== req.user?._id.toString()){
        throw new ApiError(401, "Unauthorized to update comment")
    }

    comment.content = content;
    await comment.save({validateBeforeSave: false})

    const updatedComment = await Comment.findById(commentId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) =>{
    const {commentId} = req.params;

    if(!commentId){
        throw new ApiError(400, "Missing comment Id")
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment Id")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "Comment doesn't exist");
    }

    if(comment.owner?.toString() !== req.user?._id.toString()){
        throw new ApiError(401, "Unauthorized to update comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    )
})

export {
    getVideoComments,
    addComment,
    deleteComment,
    updateComment
}