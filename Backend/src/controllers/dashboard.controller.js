import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res)=>{
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {userId} = req.user?._id;

    if(!userId){
        throw new ApiError(400, "Missing channel id")
    }

    if(!isValidObjectId(userId)){
        throw new ApiError(401, "Invalid user id")
    }

    const user = await User.findById(userId);
    
    if(!user){
        throw new ApiError(404, "User doesn't exist");
    }

    const channelStats = await User.aggregate([
        {
            $match: {
                id: user?._id
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "video",
                            as: "likes"
                        }
                    },
                    {
                        $addFields: {
                            likeCount: {
                                $size: "$likes"
                            }
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                totalLikeCount: {
                    $sum: "$likeCount"
                }
            }
        }
    ])
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
}