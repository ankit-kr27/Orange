// Before logging out
// first we fetch the accessToken from the cookie or the header
// if token exist -> a user is logged in, else -> no user is logged in.
// decode the token to fetch the payload
// now the decodedToken contains _id of the logged in user.
// we fetch the user from db with that _id
// we remove password and refreshToken fields from user object.
// if user does not exist then the access token was wrong
// finally we add user to the req and call next()
// in the logoutUser function we will have the access of a particular user(req.user) who is needed to be logged out

// we may need this functionality to verify if the user is authenticated or not

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next)=>{     // for creating mw we need next flag as well
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");  
        // cookies may or may not have the access token(in case of mobile application)
        // in that case, the user provides us with a custom header with "Authorization" as key and "Bearer <token>" as it's value.
        // by using replace, we are removing "Bearer " from the value and just getting the access token.
        // Authorization: Bearer <token>
        // why are we using access token only and not the refresh token?
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)     // only the user with the secret can access it
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401, "Invalid access token")
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})