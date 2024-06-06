import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import { User } from "../models/user.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// const registerUser = (req, res, next)=>{
//     try{
//         res.status(200).json({
//             message: "ok"
//         })
//     }catch(err){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }

const generateAccessAndRefreshTokens = async (userId)=>{    // generating them only once and using them again and again.
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // we don't store the access token, we give to the user only but we store the refresh token in the db as well, so the user don't need to login again and again.

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});     // as we are just saving for a new field we don't need to validate anything else. (We know what we are doing)

        return {accessToken, refreshToken};

    }catch(err){
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
}

const registerUser = asyncHandler(async (req, res)=>{   // this will execute the provided async function with the help of promise
    // res.status(200).json({
    //     message: "ok"
    // })

    /* 
        *** ALGORITHM ***
        # get user details from frontend
        # validation - non empty
        # check if user already exists: username, email
        # check for images, check for avatar
        # upload them to cloudinary, avatar
        # create user object - create entry in db
        # remove password and refresh token field from response
        # check for user creation 
        # return response
    */

// USER DETAILS
    const {fullName, username, password, email} = req.body;
    // console.log(fullName, username, password, email);
    
// VALIDATION
    if(
        [fullName, username, password, email].some(field => field?.trim() === "")   // checks if any of the fields return true or not
    ){
        throw new ApiError(400, "All fields are required!")
    }

// IF USER EXISTS
    const existedUser = await User.findOne(   // User can directly interact with mongoDB as it has been created with the help of monngoose
        {  // email or below
            $or: [{ username }, { email }]    // returns an object of users existing in the db with same username or email fields
        }
    )
        // console.log("Existed User: ", existedUser);
    if(existedUser){
        throw new ApiError(409, "User with username or email already exists");
    }

// FETCH IMAGE LOCAL PATH 
     // as express gives us access to req.body(), multer(middleware) adds on to give us the access of other fields such as files(in case of multer)
    let avatarLocalPath;
    if(req.files && req.files.avatar)
        avatarLocalPath = req.files.avatar[0]?.path      // will return the path of the file as uploaded by multer on to the server 

    // const coverImageLocalPath = req.files?.coverImage[0]?.path      // optional chaining (this line causes error)
    let coverImageLocalPath
    if(req.files && req.files.coverImage)
        coverImageLocalPath = req.files.coverImage[0]?.path

// CHECK IF AVATAR EXISTS
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    // UPLOAD THEM TO CLOUDINARY
    const avatar = await uploadOnCloudinary(avatarLocalPath)   // that's why we made this async
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);      // if it doesn't exist, cloudinary won't give an error but rather returns null.
    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    // CREATE AN ENTRY IN DB
    const user = await User.create({    // db entry will take time that's why await
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",   // if coverImage exists then extract it otherwise let it be an empty string
        email: email.toLowerCase(),
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(   // directly checking from the db if the user has been created or not.
        "-password -refreshToken"   // by default every field is selected
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, createdUser, "User registered successfully")   // status  code | data | message
    )
})

// *** LOGIN USER ***
const loginUser = asyncHandler(async (req, res)=>{
    /* 
        req -> data
        find the user
        password check
        generate access and refresh token
        send access token and ref. token via cookies
    */

    const {email, username, password} = req.body;
    // console.log(email, username, password)

    if(!email && !username){
        throw new ApiError(400, "username or email is required");
    }

    if(!password){
        throw new ApiError(400, "password is required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]  // $or is provided by mongoDB and array of objects is passed
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }
// User is an object of mongoose(which provides us methods such as findOne etc; it refers to the model) while user is the object provided by mongodb(which is an individual instance of the User model)
    const isPasswordValid = await user.isPasswordCorrect(password)  
    // schema method can be called for an instance of user
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    // now if finally the password given is also correct then we'll create the access and the refresh token. (as it is done oftenly, we'll create a separate function for that)

    // AT and RT are generated for a particular user and only the RT is saved into the db.
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"   // no need to send these into the response
    );     
    // new user is different from previous user as it contains the refresh token, which was generated and added after the previous call.
    
    // cookie options
    const options = { // by default they are modifiable by frontend also  
        httpOnly: true,
        secure: true
        // but after these they are only server modifiable
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options) 
    .json(
        new ApiResponse(    // status code | data | message
            200, 
            {   // data
                user: loggedInUser, 
                accessToken, 
                refreshToken   // passing accessToken and refreshToken in data also as mobile apps doesn't have access to cookies
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req, res)=>{
    // clear cookies
    // remove access and refresh token

    // There is an issue while logging out that how can we get the access of user, do we have to again make a db call? but it will allow to logout anyone?
    // for that we will create our own middleware (auth.middleware.js), and req will have the access of cookies
    
    // Finding the user and updating the refreshToken
    await User.findByIdAndUpdate(
        req.user._id,   // find by this id
        {               // what to update
            $unset: {
                refreshToken: 1,    // this removes the field from the document
            }
        },
        {
            new: true   // this will return the new updated user
        }
    )
    // We, got got req.user._id via auth middleware. It helped us to identify which user to log out by putting the in session user into the req. 
    // it got the user by fetching the current session AT from the cookies. Then retrieved the payload via jwt.verify. it gave us the _id.

    // Clearing the cookies
    const options = {
        httpOnly: true, // prevents the client side to access the cookie
        secure: true    // sends the cookie in only encrypted form
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res)=>{
    /* 
        We've added access and refresh token to the cookies
        If access token get's expired, we can fetch the refresh token from the cookies and create new ones.
    */
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request");    // If a user is not holding the refresh token in the cookies, they are not logged in.
    }

    try {   // if RT is expired jwt.verify will return an error and will be caught by the catch block
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ) 

        const user = await User.findById(decodedToken?._id);
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token");
        }
    
        // Now we'll check if the incomingRefreshToken and the user we found by decoding the token(and getting the _id) has the same refresh token or not
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
        // In case it is verified but is some other token that isn't now being used. Like you logged out and removed both tokens but they are not expired. Incase someone sends that token in request.
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken},
                "Access token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res)=>{
    const {oldPassword, newPassword} = req.body;

    if(!(oldPassword && newPassword)){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user?._id);    // user has been added to the req object while logging in via auth middleware

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordValid){
        throw new ApiError(400, "Incorrect password");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
})

const getCurrentUser = asyncHandler(async (req, res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
})

// updating text based data
const updateAccountDetails = asyncHandler(async (req, res)=>{
    const {fullName, email} = req.body;     // we are only allowing email and fullName to be updated and not username.
    // We'll write separate controllers for updating coverImage and avatar
    if(!(email || fullName)){
        throw new ApiError(400, "All fields are required");
    }

    if(email){
        const existingEmail = await User.findOne({
            email: email
        })
        if(existingEmail){
            throw new ApiError(400, "Email is already used")
        }
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName: fullName,
                email: email || req.user?.email
                // updating the values both ways
            }
        },
        {new: true} // return the new updated user
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Account details updated successfully")
    )
})

// updating files based data
const updateUserAvatar = asyncHandler(async (req, res)=>{
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const user = await User.findById(req.user?._id).select("-password -refreshToken");
    const oldAvatarUrl = user?.avatar;

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading avatar")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            },
        },
        {new: true}
    ).select("-password -refreshToken")

    const response = await deleteFromCloudinary(oldAvatarUrl);

    if (!response) {
      throw new ApiError(500, "Error deleting avatar from cloudinary");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedUser, "Avatar updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async (req, res)=>{
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover image file is missing")
    }

    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    const oldCoverImageURL = user.converImage;

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage.url){
        throw new ApiError(400, "Error while uploading cover image")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            },
        },
        {new: true}
    ).select("-password -refreshToken")

    if (oldCoverImageURL) {
      const response = await deleteFromCloudinary(user.coverImage);

      if (!response) {
        throw new ApiError(500, "Error deleting cover image from cloudinary");
      }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedUser, "Cover image updated successfully")
    )
})

const getUserChannelProfile = asyncHandler(async (req, res)=>{
    // when we go to a particular channel, we go the specific url of the channel.
    // therefore, we'll fetch the details from the params
    const {username} = req.params;

    if(!username?.trim()){
        throw new ApiError(400, "Username is missing");
    }

    const channel = await User.aggregate([  // array of pipelines(objects)
        {   // this pipeline will return us the user with the same username in an array
            $match: {
                username: username?.toLowerCase()
            }
        },
        {   // joining with subscribers field
            $lookup: {  // performs left join operation to the incoming document
                from: "subscriptions",  // Model name in db gets converted to lowercase and plural
                localField: "_id",  // from the incoming document 
                foreignField: "channel", // we'll select the channel to get the no. of subscribers. channel field itself stores _id
                as: "subscribers"   
                // subscribers will be added as a field within each user(incoming document) containing the subscription document who are the subscriber of the user.
            }
        },
        {   // joining with subscribedTo field
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
                // subscribedTo will be added as a field within the user containing an array of subscription documents who the user is a subscriber of(or has subscribed to)
            }
        },
        {   // adding fields to the incoming document
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        // am I(req.user?._id) is the list subscribers of the incoming document (user). it checks within the subscriber(object) field of each subscriber document.
                        // in can check for objects as well as arrays
                        then: true,
                        else: false
                    }
                }
            }
        },
        {   // projection pipeline (showing only selected fields)
            $project: {     // customize the output document after the series of pipelines
                fullName: 1,
                username: 1,
                subscriberCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
            }
        }
    ]) // this will return an array 

    if(!channel?.length){
        throw new ApiError(404, "Channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})

const getWatchHistory = asyncHandler(async (req, res) =>{
    const user = await User.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(req.user._id)}    // it'll match each _id with ours(req.user._id)
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",     
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
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
                                $first: "$owner"    // put first element of the previous owner in the new owner.
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully"))
})

export {
    registerUser,
    loginUser, 
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory
}



// if(fullName.trim() === ""){
    //     throw new ApiError(400, "fullName is required")
    // }
    // if(username.trim() === ""){
    //     throw new ApiError(400, "username is required")
    // }
    // if(password.trim() === ""){
    //     throw new ApiError(400, "password is required")
    // }
    // if(email.trim() === ""){
    //     throw new ApiError(400, "email is required")
    // }
    // OR