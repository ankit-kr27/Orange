/*
    Task: 
    1. Toggle (video, comment, tweet)
    2. get liked videos
*/

import mongoose, { isValidObjectId, mongo } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js"
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";


const toggleVideoLike = asyncHandler(async (req, res)=>{
    /*
        1. fetch and all the necessary checks
        2. fetch the video
        3. find the like document where video._id equals videoId AND likedBy current user
        4. if liked exist, delete the document
        5. else create a new document and 
     */
    const {videoId} = req.params;

    if(!videoId){
        throw new ApiError(400, "Missing video Id");
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(401, "Invalid Video Id");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video doesn't exist");
    }

    const alreadyLiked = await Like.findOne({
        $and: [{video: videoId}, {likedBy: req.user?._id}]
    })

    if(alreadyLiked){
        await Like.deleteOne({
            $and: [{video: videoId}, {likedBy: req.user?._id}]
        })

        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Like removed from the video")
        )
    }else{
        await Like.create({
            video: videoId,
            likedBy: req.user?._id
        })
        
        const liked = await Like.findOne({
            $and: [{video: videoId}, {likedBy: req.user?._id}]
        })

        return res
        .status(200)
        .json(
            new ApiResponse(200, liked, "Liked the video")
        )
    }
})

const toggleCommentLike = asyncHandler(async (req, res)=>{
    const {commentId} = req.params;

    if(!commentId){
        throw new ApiError(400, "Missing comment Id")
    }   

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment Id")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "Comment does not exist")
    }

    const alreadyLiked = await Like.findOne({
        $and: [{likedBy: req.user?._id}, {comment: commentId}]
    })

    if(!alreadyLiked){
        await Like.create({
            likedBy: req.user?._id,
            comment: commentId
        })

        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Comment liked successfully")
        )
    }
    else{
        await Like.deleteOne(
            {
                $and: [{likedBy: req.user?._id}, {comment: commentId}]
            }
        )

        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Like removed from the comment")
        )
    }
})

const toggleTweetLike = asyncHandler(async (req, res)=>{
    const {tweetId} = req.params;

    if(!tweetId){
        throw new ApiError(400, "Missing tweet Id")
    }   

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet Id")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404, "Tweet does not exist")
    }

    const alreadyLiked = await Like.findOne({
        $and: [{likedBy: req.user?._id}, {tweet: tweetId}]
    })

    if(!alreadyLiked){
        await Like.create({
            likedBy: req.user?._id,
            tweet: tweetId
        })

        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Tweet liked successfully")
        )
    }
    else{
        await Like.deleteOne(
            {
                $and: [{likedBy: req.user?._id}, {tweet: tweetId}]
            }
        )

        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Like removed from the tweet")
        )
    }
})

const getLikedVideos = asyncHandler(async (req, res)=>{
    const userId = req.user?._id;
    
    if(!userId){
        throw new ApiResponse(401, "UserId missing")
    }

    const videos = await Like.aggregate([
        {
            $match: {
                $and: [
                    {likedBy: new mongoose.Types.ObjectId(userId)},
                    {video: {$exists: true}}
                ]
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video", 
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields:{
                likedVideosCount: {
                    $size: "$videos"
                }
            }
        },
        {
            $project: {
                videos: 1,
                likedVideosCount: 1
            }
        }
    ])

    if(!videos){
        throw new ApiError(500, "Something went wrong while fetching liked videos");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos, "Liked videos fetched successfully")
    )
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}