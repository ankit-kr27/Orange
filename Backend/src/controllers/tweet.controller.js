import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import {Tweet} from "../models/tweet.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"


const createTweet = asyncHandler(async (req, res)=>{
    const {content} = req.body;
    if(!content?.trim()){
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user?._id
    })

    const createdTweet = await Tweet.findOne(tweet?._id);

    if(!createdTweet){
        throw new ApiError(500, "Something went wrong while creating the tweet");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, createdTweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res)=>{
    // to get all the tweets created by a particular user
    const {userId} = req.params;

    if(!userId){
        throw new ApiError(400, "User id missing!");
    }

    try{
        const tweets = await Tweet.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                fullName: 1,
                                username: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    owner: {
                        $first: "$owner"
                        // because there will be only one owner so we put it out of the array
                    }
                }
            }
        ])

        return res
        .status(200)
        .json(
            new ApiResponse(200, tweets, "Tweets fetched successfully")
        )
    } catch(err){
        throw new ApiError(401, err?.message || "Invalid User Id");
    }
})

const updateTweet = asyncHandler(async (req, res)=>{
    const {tweetId} = req.params;

    if(!tweetId){
        throw new ApiError(400, "tweetId is missing");
    }

    const {content} = req.body;
    
    if(!content?.trim()){
        throw new ApiError(404, "Missing tweet content to be updated");
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(401, "Invalid tweet id");
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "Couldn't find tweet");
    }

    // IF SOMEONE IS TRYING TO UPDATE SOMEONE ELSE'S TWEET
    if(tweet?.owner.toString() !== req.user._id.toString()){    // we can't directly equate object id's
        // console.log(tweet.owner, req.user._id);
        throw new ApiError(400, "You are unauthorized to update the tweet");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        {new: true}
    )

    if(!updatedTweet){
        throw new ApiError(400, "something went wrong while updating tweet");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res)=>{
    const {tweetId} = req.params;
    
    if(!tweetId){
        throw new ApiError(400, "tweetId is missing");
    }

    // checking if tweet exists or not
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(401, "Invalid tweet id");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Couldn't find tweet");
    }

    // IF SOMEONE IS TRYING TO UPDATE SOMEONE ELSE'S TWEET
    if(tweet?.owner.toString() !== req.user._id.toString()){    // we can't directly equate object id's
        // console.log(tweet.owner, req.user._id);
        throw new ApiError(400, "You are unauthorized to delete the tweet");
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}